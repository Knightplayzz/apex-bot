const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const emoji = require('../../../data/utilities/emoji.json');
const { handleError } = require('../../../utilities/functions/utilities');
const { fetchJson } = require('../../../utilities/functions/http');

const SERVICE_TYPES = [
    { key: 'ApexOauth_Crossplay', label: '[Crossplay] Apex Login' },
    { key: 'Origin_login', label: 'Origin Login' },
    { key: 'EA_accounts', label: 'EA Accounts' },
    { key: 'EA_novafusion', label: 'Lobby & MatchMaking Services' },
];

const REGIONS = [
    { key: 'US-East', label: 'US East' },
    { key: 'US-Central', label: 'US Central' },
    { key: 'US-West', label: 'US West' },
    { key: 'EU-East', label: 'EU East' },
    { key: 'EU-West', label: 'EU West' },
    { key: 'SouthAmerica', label: 'South America' },
    { key: 'Asia', label: 'Asia' },
];

module.exports = {
    premium: true,
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Shows current in-game server status.')
        .setDescriptionLocalizations({ nl: 'Toont huidige in-game server status.' }),

    async execute(interaction, auth, userData) {
        await interaction.deferReply({ ephemeral: userData.invisible });

        const url = encodeURI(`https://api.mozambiquehe.re/servers?auth=${auth}`);
        const data = await fetchJson(url, {
            cacheKey: 'apex:server-status',
            cacheTtlMs: 60 * 1000,
            label: 'Apex server status',
            timeoutMs: 10_000,
        }).catch(error => handleError(interaction, userData, error));

        const statuses = [];
        const fields = [];

        for (const service of SERVICE_TYPES) {
            fields.push({
                name: service.label,
                value: REGIONS.map(region => {
                    const regionStatus = data[service.key][region.key];
                    statuses.push(regionStatus.Status);
                    return `${getStatusIcon(regionStatus.Status)} **${region.label}:** ${regionStatus.ResponseTime}ms`;
                }).join('\n'),
                inline: true,
            });

            if (fields.length === 1 || fields.length === 4) {
                fields.push({ name: '\u200B', value: '\u200B', inline: true });
            }
        }

        const serverStatusEmbed = new EmbedBuilder()
            .setTitle('Apex Legends Server Status')
            .addFields(fields)
            .setFooter({
                text: 'Status data provided by https://apexlegendsstatus.com/',
                iconURL: interaction.client.user.displayAvatarURL(),
            })
            .setTimestamp()
            .setColor(getEmbedColor(statuses));

        return interaction.editReply({
            embeds: [serverStatusEmbed],
            ephemeral: userData.invisible,
        });
    },
};

function getStatusIcon(status) {
    if (status === 'SLOW') return `${emoji.misc.Orange} `;
    if (status === 'DOWN') return `${emoji.misc.Red} `;
    return `${emoji.misc.Green} `;
}

function getEmbedColor(statuses) {
    const slowCount = statuses.filter(status => status === 'SLOW').length;
    const downCount = statuses.filter(status => status === 'DOWN').length;

    if (downCount > 4) return 'Red';
    if (slowCount > 4 && downCount <= 4) return 'Yellow';
    return 'Green';
}
