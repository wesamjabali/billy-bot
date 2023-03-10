import { client } from '@/services/discordClient.service';
import { getRoleByName } from '@/utils/getRoleByName.util';
import dayjs from 'dayjs';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction,
    GuildMemberRoleManager,
    SlashCommandBuilder,
    ThreadChannel
} from 'discord.js';
import { Command } from './Command.class';

const cooldownMinutes = 30 as const;
const threadLifespanMinutes = 20 as const;
const warningTimesMinutes = [0.17, 0.5, 1, 5, 10, 15] as const;

export const debateCooldowns = new Map<string, Date>();

const sendWarning = (thread: ThreadChannel, timeLeft: number) => {
    thread.send(
        `Debate thread will be permanently deleted in ${
            timeLeft > 1 ? `${timeLeft.toFixed()} minutes` : `${(timeLeft * 60).toFixed()} seconds`
        }.`
    );
};

const closeThread = async (thread: ThreadChannel, topic: string) => {
    const removePromises = [];
    thread.members.cache.forEach((member) => {
        if (member.user.id !== client.user.id) {
            removePromises.push(thread.members.remove(member.id));
        }
    });
    await Promise.allSettled(removePromises);
    await thread.setLocked(true);
};

const addCooldown = (userId: string) => {
    debateCooldowns.set(userId, dayjs().add(cooldownMinutes, 'm').toDate());
};

export const debate: Command = {
    data: new SlashCommandBuilder()
        .setName('debate')
        .setDescription(`Create a ${threadLifespanMinutes}-minute debate thread.`)
        .addStringOption((option) =>
            option.setName('topic').setDescription('Topic of the debate').setRequired(true)
        )
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.channel.type !== ChannelType.GuildText) return;
        if (debateCooldowns.has(interaction.user.id)) {
            const timeLeft = dayjs(debateCooldowns.get(interaction.user.id)).diff(
                new Date(),
                'h',
                true
            );
            const formattedTimeLeft =
                timeLeft >= 1
                    ? `${timeLeft.toFixed(1)} hours`
                    : `${(timeLeft * 60).toFixed()} minutes`;
            interaction.reply({
                content: `You are on cooldown. Please wait ${formattedTimeLeft}.`,
                ephemeral: true
            });
            return;
        }
        const warningTimes = warningTimesMinutes.map((time) => threadLifespanMinutes - time);
        const topic = interaction.options.getString('topic', true);
        const channel = interaction.channel;
        if (
            !(interaction.member.roles as GuildMemberRoleManager).cache.has(
                (await getRoleByName('Senior Moderator [SM]'))?.id
            )
        ) {
            addCooldown(interaction.user.id);
        }

        const thread = await channel.threads.create({
            name: `Debate: ${topic}`,
            reason: 'Debate thread',
            type: ChannelType.PrivateThread
        });

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId('join-debate')
                .setLabel('Join debate')
                .setStyle(ButtonStyle.Primary)
        );

        const reply = await interaction.deferReply({ fetchReply: true });
        await interaction.editReply({
            content: `Debate thread for "${topic}" has started.`,
            components: [row]
        });

        warningTimes.forEach((timeLeft) => {
            setTimeout(
                () => sendWarning(thread, threadLifespanMinutes - timeLeft),
                1000 * 60 * timeLeft
            );
        });
        setTimeout(async () => {
            if (interaction.channel.type !== ChannelType.GuildText) return;
            row.setComponents(...[row.components[0].setDisabled(true)]);
            await closeThread(thread, topic);
            const message = await interaction.channel.messages.fetch(reply);
            await message.edit({
                content: `Debate thread for "${topic}" has concluded.`,
                components: [row]
            });
        }, 1000 * 60 * threadLifespanMinutes);

        thread.send(
            `Debate thread for ${topic} has started. You have ${threadLifespanMinutes} minutes to discuss until this thread is permanently deleted.`
        );
    },
    actions: [
        {
            id: 'join-debate',
            execute: async (interaction: ButtonInteraction) => {
                if (interaction.channel.type !== ChannelType.GuildText) return;
                const topic = interaction.message.content.split('"')[1];

                const thread = interaction.channel.threads.cache
                    .filter((thread) => thread.name === `Debate: ${topic}`)
                    .last();

                if (!thread) return;

                if (thread.locked) {
                    interaction.update({ content: 'This thread is locked.', components: [] });
                    return;
                }

                if (thread.members.cache.has(interaction.user.id)) {
                    interaction.reply({
                        ephemeral: true,
                        content: 'You are already in this thread!'
                    });
                    return;
                }

                await thread.members.add(interaction.user.id);

                if (
                    !(interaction.member.roles as GuildMemberRoleManager).cache.has(
                        (await getRoleByName('Senior Moderator [SM]'))?.id
                    )
                ) {
                    addCooldown(interaction.user.id);
                }

                await interaction.reply({ ephemeral: true, content: 'Joined!' });
                interaction.deleteReply();
            }
        }
    ]
};
