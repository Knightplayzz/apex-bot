const { SlashCommandBuilder, EmbedBuilder, InteractionContextType } = require('discord.js');
const lang = require('../../../data/lang/lang.json');
const { sendStats } = require('../../../utilities/functions/stats');

module.exports = {
    premium: true,
    data: new SlashCommandBuilder()
        .setName('me')
        .setContexts(InteractionContextType.Guild)
        .setDescription('Shows the stats of your linked Apex account.')
        .setDescriptionLocalizations({
            nl: 'Toont de statistieken van je gekoppelde Apex Account.',
        }),

    async execute(interaction, auth, userData) {
        const langOpt = userData.lang;
        await interaction.deferReply({ ephemeral: userData.invisible });

        const notLinkedEmbed = new EmbedBuilder()
            .setTitle(`${lang[langOpt].stats.line_17}`)
            .setDescription(`${lang[langOpt].stats.line_8}\n${lang[langOpt].stats.line_9}`)
            .setFooter({
                text: `${interaction.client.user.username} :heart:`,
                iconURL: interaction.client.user.displayAvatarURL(),
            })
            .setTimestamp()
            .setColor('Red');

        if (!userData.username || !userData.platform) {
            return interaction.editReply({
                embeds: [notLinkedEmbed],
                ephemeral: userData.invisible,
            });
        }

        return sendStats(interaction, auth, userData, userData.username, userData.platform);
    },
};
