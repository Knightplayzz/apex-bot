const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require('node-fetch');
const lang = require('../../../data/lang/lang.json');
const { handleError } = require('../../../utilities/functions/utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('map')
        .setDescription('Shows the current in-game map.')
        .setDescriptionLocalizations({ nl: 'Zie de huidige in-game map.' })
        .addStringOption(option =>
            option.setName('gamemode')
                .setDescription('Select Gamemode.')
                .setDescriptionLocalizations({ nl: 'Kies een Gamemode.' })
                .setRequired(false)
                .addChoices(
                    { name: 'Battle Royale', value: 'battle_royale' },
                    { name: 'Ranked', value: 'ranked' },
                    { name: 'LTM', value: 'ltm' },
                )),

    async execute(interaction, auth, userData) {

        const langOpt = userData.lang;
        await interaction.deferReply({ ephemeral: userData.invisible });

        const gamemode = interaction.options.get('gamemode')?.value ?? "battle_royale";
        const url = encodeURI(`https://api.mozambiquehe.re/maprotation?version=2&auth=${auth}`);
        fetch(url)
            .then(res => res.status === 200 ? res.json() : handleError(interaction, userData, res.status))
            .then(data => {
                var title = `${lang[langOpt].map.line_1} ${data[gamemode].current.map}`;
                var description = `**${data[gamemode].current.map}** ${lang[langOpt].map.line_2} <t:${data[gamemode].current.end}:R> ${lang[langOpt].map.line_3} <t:${data[gamemode].current.end}:t>.` +
                    `\n**${lang[langOpt].map.line_4}:** ${data[gamemode].next.map}`
                var image = `https://specter.apexstats.dev/ApexStats/Maps/${encodeURIComponent(data[gamemode].current.map.replace(/[\s']/g, ''))}.png?t=9&key=${process.env.messageToken}`;

                if (gamemode === 'ltm' && data?.ltm?.current?.isActive === false) {
                    title = `${lang[langOpt].map.line_5}`;
                    description = `${lang[langOpt].map.line_6}`;
                    image = null;
                }
                const mapEmbed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(description)
                    .setImage(image)
                    .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp()
                    .setColor(userData.embedColor);

                return interaction.editReply({ embeds: [mapEmbed], ephemeral: userData.invisible });
            }).catch(error => { console.error('Fetch error:', error) });
    }
}