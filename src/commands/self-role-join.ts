import { prisma } from "@/services/prisma.service";
import { AutocompleteInteraction, ChatInputCommandInteraction, GuildMemberRoleManager, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
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
        const roleString = interaction.options.getString('role');
        const dbRole = await prisma.role.findUnique({ where : { roleName : roleString}});
        
        if(dbRole !== null) {
            (interaction.member.roles as GuildMemberRoleManager).add(dbRole.id);
            interaction.reply(`Assigned you the role ${dbRole.roleName}`);
        }
        else {
            interaction.reply("not an assignable role")
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