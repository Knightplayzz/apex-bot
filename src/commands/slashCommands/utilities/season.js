const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { handleError } = require('../../../utilities/functions/utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('season')
        .setDescription('Information about the current season.')
        .setDescriptionLocalizations({ nl: 'Informatie over het huidige seizoen.' }),

    async execute(interaction, auth, userData) {

        await interaction.deferReply({ ephemeral: userData.invisible });

        const url = 'https://api.jumpmaster.xyz/seasons/Current?version=2';
        fetch(url)
            .then(res => {
                if (res.status === 200) { return res.json() } else {
                    handleError(interaction, userData, res.status);
                    return Promise.reject('Error occurred');
                }
            })
            .then(async data => {
                const season = data;
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
                            value: `\u200b`,
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
                            value: `\u200b`,
                            inline: true,
                        },
                    )
                    .setColor(userData.embedColor)
                    .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp();

                interaction.editReply({ embeds: [currentSeason], ephemeral: userData.invisible });
            }).catch(error => { console.error('Fetch error:', error) });
    }
};