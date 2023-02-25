import { prisma } from '@/services/prisma.service';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from './Command.class';

export const tag: Command = {
    data: new SlashCommandBuilder()
        .setName('tag')
        .setDescription('View a tag')
        .addStringOption((option) =>
            option.setName('name').setDescription('Name of the tag.').setRequired(true)
        )
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const name = interaction.options.getString('name', true);
        const tag = await prisma.tag.findUnique({ where: { name } });

        if (tag.content) {
            interaction.reply(`\`${name}:\`\n ${tag.content}`);
            return;
        }

        interaction.reply(`Tag ${name} doesn't exist.`);
    }
};