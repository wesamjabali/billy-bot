import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { prisma } from "@/services/prisma.service"
import { Command } from "./Command.class"

export const selfRoleList: Command = {
    data: new SlashCommandBuilder()
        .setName('self-role-list')
        .setDescription('List all self roles')
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const roles = await prisma.role.findMany()
        const reply = roles.map((role) => 
            role.roleName.concat("\n")
        ).join('')

        console.log(reply)
        interaction.reply(reply)
        
    }
}