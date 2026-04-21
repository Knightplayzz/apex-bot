const { EmbedBuilder, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');
const lang = require('../../../data/lang/lang.json');
const { handleError } = require('../../../utilities/functions/utilities');
const { fetchJson } = require('../../../utilities/functions/http');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('distribution')
        .setDescription('Shows the rank distribution.')
        .setDescriptionLocalizations({ nl: 'Toont de rank distribution.' }),

    async execute(interaction, auth, userData) {
        const langOpt = userData.lang;
        await interaction.deferReply({ ephemeral: userData.invisible });

        const canvas = Canvas.createCanvas(1200, 800);
        const ctx = canvas.getContext('2d');
        const url = 'https://apexlegendsstatus.com/lib/php/rankdistrib.php?unranked=yes';
        const distData = await fetchJson(url, {
            cacheKey: 'apex:rank-distribution',
            cacheTtlMs: 5 * 60 * 1000,
            label: 'Apex rank distribution',
            timeoutMs: 10_000,
        }).catch(error => handleError(interaction, userData, error));

        const distribEmbed = new EmbedBuilder()
            .setTitle(lang[langOpt].distribution.line_3)
            .setDescription(
                `${lang[langOpt].distribution.line_1} https://apexlegendsstatus.com\n${lang[langOpt].distribution.line_2}.`
            )
            .setColor(userData.embedColor)
            .setFooter({
                text: `${interaction.client.user.username} :heart:`,
                iconURL: interaction.client.user.displayAvatarURL(),
            })
            .setTimestamp();

        const totalCount = distData
            .slice(1)
            .reduce((count, rankData) => count + Number(rankData.totalCount), 0);
        const rankPercent = count => ((count / totalCount) * 100).toFixed(2);

        for (let i = 1; i < distData.length; i++) {
            if (i === 1) {
                const rookieCount = sumCounts(distData, 1, 4);
                distribEmbed.addFields({
                    name: 'Rookie',
                    value: `${'```ansi\n\u001b[0;33m'}${rankPercent(rookieCount)}\u001b[0;37m%${'```'}`,
                    inline: true,
                });
            }

            if (i < 27 && i > 4) {
                distribEmbed.addFields({
                    name: distData[i].name,
                    value: `${'```ansi\n\u001b[0;33m'}${rankPercent(Number(distData[i].totalCount))}\u001b[0;37m%${'```'}`,
                    inline: true,
                });
            }
        }

        const groups = [
            { index: 1, x: 20, count: sumCounts(distData, 1, 4) },
            { index: 5, x: 170, count: sumCounts(distData, 5, 8) },
            { index: 9, x: 320, count: sumCounts(distData, 9, 12) },
            { index: 13, x: 470, count: sumCounts(distData, 13, 16) },
            { index: 17, x: 620, count: sumCounts(distData, 17, 20) },
            { index: 21, x: 770, count: sumCounts(distData, 21, 24) },
            { index: 25, x: 920, count: Number(distData[25].totalCount) },
            { index: 26, x: 1070, count: Number(distData[26].totalCount) },
        ];

        for (const group of groups) {
            ctx.fillStyle = distData[group.index].color;
            ctx.fillRect(group.x, 750, 100, -((group.count / totalCount) * 1500));
        }

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'distribution.png' });
        distribEmbed.setImage(`attachment://${attachment.name}`);

        return interaction.editReply({
            embeds: [distribEmbed],
            files: [attachment],
            ephemeral: userData.invisible,
        });
    },
};

function sumCounts(data, start, end) {
    let total = 0;
    for (let i = start; i <= end; i++) {
        total += Number(data[i].totalCount);
    }
    return total;
}
