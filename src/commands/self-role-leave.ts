import { Command } from "./Command.class";
import { SlashCommandBuilder, PermissionFlagsBits, AutocompleteInteraction, ChatInputCommandInteraction, GuildMemberRoleManager, roleMention } from "discord.js";
import { prisma } from "@/services/prisma.service";
export const selfRoleLeave: Command = {
    data: new SlashCommandBuilder()
        .setName("self-role-leave")
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
            (interaction.member.roles as GuildMemberRoleManager).remove(dbRole.id);
            interaction.reply(`removed ${dbRole.roleName} from you`);
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