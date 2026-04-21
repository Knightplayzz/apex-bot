const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lang = require('../../../data/lang/lang.json');
const { handleError } = require('../../../utilities/functions/utilities');
const { fetchJson } = require('../../../utilities/functions/http');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('map')
        .setDescription('Shows the current in-game map.')
        .setDescriptionLocalizations({ nl: 'Zie de huidige in-game map.' })
        .addStringOption(option =>
            option
                .setName('gamemode')
                .setDescription('Select Gamemode.')
                .setDescriptionLocalizations({ nl: 'Kies een Gamemode.' })
                .setRequired(false)
                .addChoices(
                    { name: 'Battle Royale', value: 'battle_royale' },
                    { name: 'Ranked', value: 'ranked' },
                    { name: 'LTM', value: 'ltm' }
                )
        ),

    async execute(interaction, auth, userData) {
        const langOpt = userData.lang;
        await interaction.deferReply({ ephemeral: userData.invisible });

        const gamemode = interaction.options.get('gamemode')?.value ?? 'battle_royale';
        const url = encodeURI(`https://api.mozambiquehe.re/maprotation?version=2&auth=${auth}`);
        const data = await fetchJson(url, {
            cacheKey: 'apex:maprotation:v2',
            cacheTtlMs: 30 * 1000,
            label: 'Apex map rotation',
            timeoutMs: 10_000,
        }).catch(error => handleError(interaction, userData, error));

        let title = `${lang[langOpt].map.line_1} ${data[gamemode].current.map}`;
        let description =
            `**${data[gamemode].current.map}** ${lang[langOpt].map.line_2} <t:${data[gamemode].current.end}:R> ${lang[langOpt].map.line_3} <t:${data[gamemode].current.end}:t>.` +
            `\n**${lang[langOpt].map.line_4}:** ${data[gamemode].next.map}`;
        let image = `https://specter.apexstats.dev/ApexStats/Maps/${encodeURIComponent(data[gamemode].current.map.replace(/[\s']/g, ''))}.png?t=9&key=${process.env.messageToken}`;

        if (gamemode === 'ltm' && data?.ltm?.current?.isActive === false) {
            title = `${lang[langOpt].map.line_5}`;
            description = `${lang[langOpt].map.line_6}`;
            image = null;
        }

        const mapEmbed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setImage(image)
            .setFooter({
                text: `${interaction.client.user.username} :heart:`,
                iconURL: interaction.client.user.displayAvatarURL(),
            })
            .setTimestamp()
            .setColor(userData.embedColor);

        return interaction.editReply({ embeds: [mapEmbed], ephemeral: userData.invisible });
    },
};
