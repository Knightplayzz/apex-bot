const { EmbedBuilder, SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fetch = require('node-fetch');
const Canvas = require('canvas');
const lang = require('../../../data/lang/lang.json');
const { handleError } = require('../../../utilities/functions/utilities');

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
        const url = "https://apexlegendsstatus.com/lib/php/rankdistrib.php?unranked=yes";
        fetch(url)
            .then(res => res.status === 200 ? res.json() : handleError(interaction, userData, res.status))
            .then(async data => {

                const distData = data;

                const distribEmbed = new EmbedBuilder()
                    .setTitle(lang[langOpt].distribution.line_3)
                    .setDescription(`${lang[langOpt].distribution.line_1} https://apexlegendsstatus.com\n${lang[langOpt].distribution.line_2}.`)
                    .setColor(userData.embedColor)
                    .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp();

                const allCount = () => {
                    let count = 0;
                    for (let i = 1; i < distData.length; i++) {
                        count += Number(distData[i].totalCount);
                    }
                    return count;
                };
                for (let i = 1; i < distData.length; i++) {
                    //makes sure that not over 25 item gets added to the embed (discords allows 25) here the value is set to 27 cuz the first 4 (rookie) are put in one field
                    if (i < 27 && i > 4) {
                        distribEmbed.addFields({ name: distData[i].name, value: `${"```ansi\n\u001b[0;33m"}${((Number(distData[i].totalCount) / allCount() * 100).toFixed(2)).toString()}\u001b[0;37m%${"```"}`, inline: true });
                    }
                    //put rookie all in one rank
                    if (i === 1) {
                        distribEmbed.addFields({ name: "Rookie", value: `${"```ansi\n\u001b[0;33m"}${(((Number(distData[1].totalCount) + Number(distData[2].totalCount) + Number(distData[3].totalCount) + Number(distData[4].totalCount)) / allCount() * 100).toFixed(2)).toString()}\u001b[0;37m%${"```"}`, inline: true });
                    }
                }

                const rookie = distData[1].totalCount + distData[2].totalCount + distData[3].totalCount + distData[4].totalCount;
                const bronze = distData[5].totalCount + distData[6].totalCount + distData[7].totalCount + distData[8].totalCount;
                const silver = distData[9].totalCount + distData[10].totalCount + distData[11].totalCount + distData[12].totalCount;
                const gold = distData[13].totalCount + distData[14].totalCount + distData[15].totalCount + distData[16].totalCount;
                const plat = distData[17].totalCount + distData[18].totalCount + distData[19].totalCount + distData[20].totalCount;
                const dia = distData[21].totalCount + distData[22].totalCount + distData[23].totalCount + distData[24].totalCount;
                const masters = distData[25].totalCount;
                const pred = distData[26].totalCount;

                let x = 1500;

                const diff_rookie = rookie / allCount() * x;
                const diff_bronze = bronze / allCount() * x;
                const diff_silver = silver / allCount() * x;
                const diff_gold = gold / allCount() * x;
                const diff_plat = plat / allCount() * x;
                const diff_dia = dia / allCount() * x;
                const diff_master = masters / allCount() * x;
                const diff_pred = pred / allCount() * x;

                ctx.fillStyle = distData[1].color;
                ctx.fillRect(20, 750, 100, -diff_rookie);

                ctx.fillStyle = distData[5].color;
                ctx.fillRect(170, 750, 100, -diff_bronze);

                ctx.fillStyle = distData[9].color;
                ctx.fillRect(320, 750, 100, -diff_silver);

                ctx.fillStyle = distData[13].color;
                ctx.fillRect(470, 750, 100, -diff_gold);

                ctx.fillStyle = distData[17].color;
                ctx.fillRect(620, 750, 100, -diff_plat);

                ctx.fillStyle = distData[21].color;
                ctx.fillRect(770, 750, 100, -diff_dia);

                ctx.fillStyle = distData[25].color;
                ctx.fillRect(920, 750, 100, -diff_master);

                ctx.fillStyle = distData[26].color;
                ctx.fillRect(1070, 750, 100, -diff_pred);

                var attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'distribution.png' });
                distribEmbed.setImage(`attachment://${attachment.name}`)

                return await interaction.editReply({ embeds: [distribEmbed], files: [attachment], ephemeral: userData.invisible });
            }).catch(error => { console.error('Fetch error:', error) });
    }
}