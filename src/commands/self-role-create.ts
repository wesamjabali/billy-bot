import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
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
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const role= interaction.options.getRole('role')
        
        await prisma.role.create( 
        {data: {
            roleName: role.name,
            id: role.id
        }}
            
        )
    }
}