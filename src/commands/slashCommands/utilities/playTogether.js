const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play-together')
        .setDescription('Find a player to play together with.')
        .addStringOption(option =>
            option.setName('partysize')
                .setDescription('Pick a party size.')
                .setDescriptionLocalizations({ nl: 'Kies aantal spelers' })
                .setRequired(true)
                .addChoices(
                    { name: 'DUO', value: 'duo' },
                    { name: "TRIO", value: "trio" },
                )
        )
        .addStringOption(option =>
            option.setName('gamemode')
                .setDescription('Select Gamemode.')
                .setDescriptionLocalizations({ nl: 'Kies een Gamemode.' })
                .setRequired(true)
                .addChoices(
                    { name: 'Battle Royale', value: 'battle_royale' },
                    { name: 'Ranked', value: 'ranked' },
                    { name: 'LTM', value: 'ltm' },
                )
        ),

    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true });

        const embed = new EmbedBuilder()
            .setTitle(`COMMING SOON`)
            .setDescription(`UNDER MAINTANENCE`)
            .setColor('Red');

        interaction.editReply({ embeds: [embed], ephemeral: true });
    }
}