import { AutocompleteInteraction, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { prisma } from "@/services/prisma.service"
import { Command } from "./Command.class"

export const selfRoleDelete: Command = {
    data: new SlashCommandBuilder()
        .setName('self-role-delete')
        .setDescription('delete a self role')
        .addStringOption((option) => 
            option
                .setName('role')
                .setDescription('which self role to make delete')
                .setRequired(true)
                .setAutocomplete(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const roleString =  interaction.options.getString('role');
        if(!await prisma.role.findUnique({ where : { roleName: roleString}})){
             interaction.reply('role isn\'t self assignable')
        }else {
            await prisma.role.delete({where : {roleName : roleString}})
            interaction.reply(`${roleString} has just been removed as self role`)
        }
    },
    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedValue = interaction.options.getFocused();
        const roles = ( 
            await prisma.role.findMany({ where : { roleName : { contains : focusedValue } } })
        ).map((t) => ({ name: t.roleName, value: t.roleName}))
        interaction.respond(roles)
    }
}