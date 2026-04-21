const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { handleError } = require('../../../utilities/functions/utilities');
const { fetchJson } = require('../../../utilities/functions/http');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('season')
        .setDescription('Information about the current season.')
        .setDescriptionLocalizations({ nl: 'Informatie over het huidige seizoen.' }),

    async execute(interaction, auth, userData) {
        await interaction.deferReply({ ephemeral: userData.invisible });

        const url = 'https://api.jumpmaster.xyz/seasons/Current?version=2';
        const season = await fetchJson(url, {
            cacheKey: 'apex:season:current',
            cacheTtlMs: 60 * 60 * 1000,
            label: 'Apex current season',
            timeoutMs: 10_000,
        }).catch(error => handleError(interaction, userData, error));

        const currentSeason = new EmbedBuilder()
            .setTitle(`Apex Legends: ${season.info.title}`)
            .setURL(season.info.data.url)
            .setDescription(season.info.description)
            .addFields(
                {
                    name: 'Season Start Date',
                    value: `<t:${season.dates.start.timestamp}:D>\n<t:${season.dates.start.timestamp}:t>\n<t:${season.dates.start.timestamp}:R>`,
                    inline: true,
                },
                {
                    name: 'Season Split Date',
                    value: `<t:${season.dates.split.timestamp}:D>\n<t:${season.dates.split.timestamp}:t>\n<t:${season.dates.split.timestamp}:R>`,
                    inline: true,
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: true,
                },
                {
                    name: 'Ranked End Date',
                    value: `<t:${season.dates.end.rankedEnd}:D>\n<t:${season.dates.end.rankedEnd}:t>\n<t:${season.dates.end.rankedEnd}:R>`,
                    inline: true,
                },
                {
                    name: 'Season End Date',
                    value: `<t:${season.dates.end.timestamp}:D>\n<t:${season.dates.end.timestamp}:t>\n<t:${season.dates.end.timestamp}:R>`,
                    inline: true,
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: true,
                }
            )
            .setColor(userData.embedColor)
            .setFooter({
                text: `${interaction.client.user.username} :heart:`,
                iconURL: interaction.client.user.displayAvatarURL(),
            })
            .setTimestamp();

        return interaction.editReply({ embeds: [currentSeason], ephemeral: userData.invisible });
    },
};
