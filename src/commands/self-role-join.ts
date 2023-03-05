import { prisma } from "@/services/prisma.service";
import { AutocompleteInteraction, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "./Command.class";


export const selfRoleJoin: Command = {
    data: new SlashCommandBuilder()
        .setName("self-role-join")
        .setDescription('join a self assignable role')
        .addStringOption((option) => 
            option
                .setName('role').setDescription('role you want to get').setAutocomplete(true).setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers).toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const roleSting = interaction.options.getString('role')
    },
    
    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedValue = interaction.options.getFocused();
        // const roles = ( 
        //     await prisma.role.findMany({ where : { roleName : { contains : focusedValue } } })
        // ).map((t) => ({ name: t.roleName, value: t.roleName}))
        
        // interaction.respond(roles)

        const roles = ( interaction.guild.roles.cache.filter((role) => role.name.includes(focusedValue))
        ).filter(async (role) =>  await prisma.role.findUnique({where :{ id : role.id }}))
        roles.forEach((role) => console.log(role.name))
        

        //test
        // interaction.respond(response)
    }
}