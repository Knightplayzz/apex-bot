const { SlashCommandBuilder } = require('discord.js');
const { sendStats } = require('../../../utilities/functions/stats');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Shows legends stats, account and rank info, and online status.')
        .setDescriptionLocalizations({ nl: 'Toont de statistieken, account rank informatie en online status.' })
        .addStringOption(option =>
            option.setName('platform')
                .setDescription('The platform you play Apex on.')
                .setDescriptionLocalizations({ nl: 'Het platform waarop je Apex speelt.' })
                .setRequired(true)
                .addChoices(
                    { name: 'PC(Steam/Origin)', value: 'PC' },
                    { name: 'PlayStation', value: 'PS4' },
                    { name: 'Xbox', value: 'X1' },
                ))
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Your in-game username.')
                .setDescriptionLocalizations({ nl: 'Je in-game gebruikersnaam.' })
                .setRequired(true)
        ),

    async execute(interaction, auth, userData) {

        await interaction.deferReply({ ephemeral: userData.invisible });

        const platform = interaction.options.get('platform').value;
        const username = interaction.options.getString('username');
        sendStats(interaction, auth, userData, username, platform);
    }
}