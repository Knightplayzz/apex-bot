const { EmbedBuilder } = require('discord.js');
const emoji = require('../../data/utilities/emoji.json');
const lang = require('../../data/lang/lang.json');
const { checkData, handleError } = require('../functions/utilities');
const { fetchJson } = require('./http');

async function sendStats(interaction, auth, userData, username, platform) {
    const langOpt = userData.lang;
    const url = encodeURI(
        `https://api.mozambiquehe.re/bridge?version=5&platform=${platform}&player=${username}&auth=${auth}`
    );
    const data = await fetchJson(url, {
        cacheKey: `apex:stats:${platform}:${username.toLowerCase()}`,
        cacheTtlMs: 30 * 1000,
        label: 'Apex player stats',
        timeoutMs: 10_000,
    }).catch(error => handleError(interaction, userData, error));

    checkData(data, interaction, userData);

    const badge1 = data?.legends?.selected?.data?.[0];
    const badge2 = data?.legends?.selected?.data?.[1];
    const badge3 = data?.legends?.selected?.data?.[2];

    const accountCompletion = Math.floor((data.global.level / 500) * 100);
    const levelPrestige = data.global.levelPrestige;
    const levelPrestigeProcent = Math.floor(
        ((data.global.level + 500 * levelPrestige) / 2000) * 100
    );

    const battlepass = data.global.battlepass?.level?.toString() ?? '1';
    const battlepassCompletion = Math.floor((battlepass / 110) * 100);

    const status = getStatus(data.realtime);
    let rank = data.global.rank.rankName;
    let rankDiv = data.global.rank.rankDiv;
    if (rank === 'Unranked') {
        rank = 'Rookie';
        rankDiv = '4';
    }

    const statsEmbed = new EmbedBuilder()
        .setTitle(`${emoji.logo[data.global.platform]} ${data.global.name}`)
        .setDescription(`**Status:**${emoji.misc[status.color]}${status.state}`)
        .addFields([
            {
                name: `${emoji.misc.level} Account`,
                value:
                    `${emoji.misc.grey_dot} Level ${data.global.level} (${accountCompletion}%)` +
                    `\n${emoji.misc.grey_dot} Prestige ${levelPrestige} (${levelPrestigeProcent}%)` +
                    '\n\n **Battle Royale Ranked**' +
                    `\n${emoji.ranked[rank]} ${rank} ${rankDiv}` +
                    `\n${emoji.misc.grey_dot} ${data.global.rank.rankScore} RP`,
                inline: true,
            },
            {
                name: `${emoji.misc.logo} Battle Pass`,
                value:
                    `${emoji.misc.grey_dot} Level ${battlepass} (${battlepassCompletion}%)` +
                    '\n\n\n**Career Stats**' +
                    `\n${emoji.misc.grey_dot} Kills ${Array.isArray(data.legends.all?.Global?.data) ? (data.legends.all.Global.data[0]?.value ?? '-') : '-'} ${data.legends?.all?.Global?.data?.[0]?.rank?.topPercent ? ` (top ${data.legends.all.Global.data[0].rank.topPercent}%)` : ''}` +
                    `\n${emoji.misc.grey_dot} Wins ${Array.isArray(data.legends.all?.Global?.data) ? (data.legends.all.Global.data[2]?.value ?? '-') : '-'} ${data.legends?.all?.Global?.data?.[2]?.rank?.topPercent ? ` (top ${data.legends.all.Global.data[2].rank.topPercent}%)` : ''}`,
                inline: true,
            },
            {
                name: '\u200b',
                value: `**${lang[langOpt].stats.line_4}**`,
                inline: false,
            },
            {
                name: badge1?.name ?? 'No data',
                value: typeof badge1?.value === 'number' ? badge1.value.toLocaleString() : '**-**',
                inline: true,
            },
            {
                name: badge2?.name ?? 'No data',
                value: typeof badge2?.value === 'number' ? badge2.value.toLocaleString() : '**-**',
                inline: true,
            },
            {
                name: badge3?.name ?? 'No data',
                value: typeof badge3?.value === 'number' ? badge3.value.toLocaleString() : '**-**',
                inline: true,
            },
        ])
        .setImage(
            `https://specter.apexstats.dev/ApexStats/Legends/${data.legends.selected.LegendName}.png?t=9&key=${process.env.messageToken}`
        )
        .setColor(userData.embedColor)
        .setFooter({ text: `${lang[langOpt].stats.line_6}!` });

    return interaction.editReply({ embeds: [statsEmbed], ephemeral: userData.invisible });
}

function getStatus(data = {}) {
    if (data.isOnline === 1 && data.isInGame === 1) return { state: 'In a Match', color: 'Orange' };
    if (data.isOnline === 1) return { state: 'Online (Lobby)', color: 'Green' };
    return { state: 'Offline', color: 'Black' };
}

module.exports = { sendStats };
