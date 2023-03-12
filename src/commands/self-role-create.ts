import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { prisma } from "@/services/prisma.service"
import { Command } from "./Command.class"

export const selfRoleCreate: Command = {
    data: new SlashCommandBuilder()
        .setName('self-role-create')
        .setDescription('Create a self role')
        .addRoleOption((option) => 
            option
                .setName('role')
                .setDescription('which role to make self-joinable')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const role = interaction.options.getRole('role');
        if(await prisma.role.findUnique({ where : { id: role.id}})){
            interaction.reply('role already self assignable')
        }else {
            await prisma.role.create({
                data: {
                    roleName : role.name,
                    id: role.id
                }
            })
            interaction.reply(`${role.name} has just become self-assignable`)
        }
    }
}