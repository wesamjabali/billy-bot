import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { prisma } from "@/services/prisma.service"
import { Command } from "./Command.class"

export const selfRoleList: Command = {
    data: new SlashCommandBuilder()
        .setName('self-role-list')
        .setDescription('List all self roles')
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const roleString = (await prisma.role.findMany())
        .map((role) => 
            role.roleName    
        ).join(', ')
        console.log(roleString)
        interaction.reply(`\`\`\`${roleString}\`\`\``)w
    }
}