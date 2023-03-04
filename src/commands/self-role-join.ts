import { prisma } from "@/services/prisma.service";
import { AutocompleteInteraction, ChatInputCommandInteraction, PermissionFlagsBits, roleMention, SlashCommandBuilder } from "discord.js";
import { Command } from "./Command.class";


export const selfroleAdd: Command = {
    data: new SlashCommandBuilder()
        .setName("self-role-join")
        .addStringOption((option) => 
            option
                .setName("role").setDescription("role you want to get").setAutocomplete(true).setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers).toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {

    },
    
    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedValue = interaction.options.getFocused();
        const roles = (
            await prisma.role.findMany({ where: { roleName : { contains : focusedValue } } })
        ).map((t) => ({ name: t.roleName}))
    }
}