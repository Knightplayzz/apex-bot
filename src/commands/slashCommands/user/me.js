const { SlashCommandBuilder, EmbedBuilder, InteractionContextType } = require('discord.js');
const lang = require('../../../data/lang/lang.json');
const { sendStats } = require('../../../utilities/functions/stats');
require('dotenv').config();

module.exports = {
    premium: true,
    data: new SlashCommandBuilder()
        .setName('me')
        .setContexts(InteractionContextType.Guild)
        .setDescription('Shows the stats of your linked Apex account.')
        .setDescriptionLocalizations({ nl: 'Toont de statistieken van je gekoppelde Apex Account.' }),

    async execute(interaction, auth, userData) {

        var langOpt = userData.lang;
        await interaction.deferReply({ ephemeral: userData.invisible });

        var notLinkedEmbed = new EmbedBuilder()
            .setTitle(`${lang[langOpt].stats.line_17}`)
            .setDescription(`${lang[langOpt].stats.line_8}\n${lang[langOpt].stats.line_9}`)
            .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()
            .setColor("Red");

        if (userData.username && userData.platform) {
            const platform = userData.platform;
            const username = userData.username;
            sendStats(interaction, auth, userData, username, platform);
        } else return interaction.editReply({ embeds: [notLinkedEmbed], ephemeral: userData.invisible });
    }
}