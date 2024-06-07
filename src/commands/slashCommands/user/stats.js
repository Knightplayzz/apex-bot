const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const emoji = require('../../../data/utilities/emoji.json');
const lang = require('../../../data/lang/lang.json');
const { getStatus, handleError, sentLookUpError } = require('../../../utilities/functions/utilities');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Shows legends stats, account and rank info, and online status.')
        .setDescriptionLocalizations({
            nl: 'Toont de statistieken, account rank informatie en online status.'
        })
        .setDMPermission(true)
        .addStringOption(option =>
            option.setName('platform')
                .setDescription('The platform you play Apex on.')
                .setDescriptionLocalizations({
                    nl: 'Het platform waarop je Apex speelt.'
                })
                .setRequired(true)
                .addChoices(
                    { name: 'PC(Steam/Origin)', value: 'PC' },
                    { name: 'PlayStation', value: 'PS4' },
                    { name: 'Xbox', value: 'X1' },
                ))
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Your in-game username.')
                .setDescriptionLocalizations({
                    nl: 'Je in-game gebruikersnaam.'
                })
                .setRequired(true)
        ),

    async execute(interaction, auth, userData) {

        var langOpt = userData.lang;

        await interaction.deferReply({ ephemeral: userData.invisible });

        const platform = interaction.options.get('platform').value;
        const player = interaction.options.getString('username');


        var url = encodeURI(`https://api.mozambiquehe.re/bridge?version=5&platform=${platform}&player=${player}&auth=${auth}`);
        fetch(url)
            .then(res => {
                if (res.status === 200) { return res.json() } else {
                    handleError(interaction, userData, res.status);
                    return Promise.reject('Error occurred');
                }
            })
            .then(data => {
                if (!data || !data?.global || !data?.global?.name || data?.global?.name === '') return sentLookUpError(interaction, userData);

                var badge1 = data?.legends?.selected?.data?.[0];
                var badge2 = data?.legends?.selected?.data?.[1];
                var badge3 = data?.legends?.selected?.data?.[2];

                const accountCompletion = Math.floor((data.global.level / 500) * 100);
                var levelPrestige = data.global.levelPrestige;
                var levelPrestigeProcent = Math.floor(((data.global.level + 500 * levelPrestige) / 2000) * 100);

                var battlepass = data.global.battlepass?.level?.toString() ?? "1";
                var battlepassCompletion = Math.floor((battlepass / 110) * 100);

                var status = getStatus(data.realtime);
                var rank = data.global.rank.rankName;
                var rankDiv = data.global.rank.rankDiv;
                if (rank === "Unranked") {
                    rank = "Rookie";
                    rankDiv = "4";
                }


                var statsEmbed = new EmbedBuilder()
                    .setTitle(`${emoji.logo[data.global.platform]} ${data.global.name}`)
                    .setDescription(`**Status:**${emoji.misc[status.color]}${status.state}`)
                    .addFields([
                        {
                            name: `${emoji.misc.level} Account`,
                            value: `${emoji.misc.grey_dot} Level ${data.global.level} (${accountCompletion}%)` +
                                `\n${emoji.misc.grey_dot} Prestige ${levelPrestige} (${levelPrestigeProcent}%)` +
                                `\n\n ** Battle Royale Ranked**` +
                                `\n${emoji.ranked[rank]} **${rank} ${rankDiv}**` +
                                `\n${emoji.misc.grey_dot} ${data.global.rank.rankScore} RP`,
                            inline: true,
                        },
                        {
                            name: `${emoji.misc.logo} Battle Pass`,
                            value: `${emoji.misc.grey_dot} Level ${battlepass} (${battlepassCompletion}%)`,
                            inline: true,
                        },
                        {
                            name: `\u200b`,
                            value: `**${lang[langOpt].stats.line_4}**`,
                            inline: false,
                        },
                        {
                            name: badge1?.name ?? "No data",
                            value: (typeof badge1?.value === 'number') ? badge1.value.toLocaleString() : "**-**",
                            inline: true,
                        },
                        {
                            name: badge2?.name ?? "No data",
                            value: (typeof badge2?.value === 'number') ? badge1.value.toLocaleString() : "**-**",
                            inline: true,
                        },
                        {
                            name: badge3?.name ?? "No data",
                            value: (typeof badge3?.value === 'number') ? badge1.value.toLocaleString() : "**-**",
                            inline: true,
                        },
                    ])
                    .setImage(`https://specter.apexstats.dev/ApexStats/Legends/${data.legends.selected.LegendName}.png?t=9&key=${process.env.messageToken}`)
                    .setColor(userData.embedColor)
                    .setFooter({ text: `${lang[langOpt].stats.line_6}!` });

                interaction.editReply({ embeds: [statsEmbed], ephemeral: userData.invisible });

            }).catch(error => { console.error('Fetch error:', error) });
    }
}