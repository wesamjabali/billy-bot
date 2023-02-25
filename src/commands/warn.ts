import { prisma } from '@/services/prisma.service';
import { addUserToDb } from '@/utils/addUser.util';
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Command } from './Command.class';

export const warn: Command = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user.')
        .addUserOption((option) =>
            option.setName('user').setDescription('The user to warn.').setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('reason').setDescription('Reason for warn.').setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const warnedUser = interaction.options.getUser('user', true);
        const reason = interaction.options.getString('reason', true);
        await addUserToDb(warnedUser.id);

        await prisma.warning.create({ data: { userId: warnedUser.id, reason: reason } });

        interaction.reply(`Warned <@${warnedUser.id}> for ${reason}`);
    }
};
