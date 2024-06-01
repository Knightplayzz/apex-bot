const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { embedColor } = require('../../../data/utilities/utilities.json');
const { sentErrorEmbed } = require('../../../utilities/functions/utilities')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('current')
        .setDescription('Information about the current season.'),

    async execute(interaction, auth, langOpt) {

        await interaction.deferReply({ ephemeral: true });

        const url = 'https://api.jumpmaster.xyz/seasons/Current?version=2';
        fetch(url).then(res => {
            if (res.status === 200) { return res.json() } else return sentErrorEmbed(interaction, langOpt, `current.js l.17`)
        }).then(async data => {
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
                .setColor(embedColor)
                .setImage(`${encodeURI(season.info.data.image)}?t=${Math.floor(Math.random() * 10) + 1}`)
                .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            interaction.editReply({ embeds: [currentSeason], ephemeral: true });
        });
    },
};