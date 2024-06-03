const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const emoji = require('../../../data/utilities/emoji.json');
const { embedColor } = require('../../../data/utilities/utilities.json');
const lang = require('../../../data/lang/lang.json');
const { getStatus, sentErrorEmbed } = require('../../../utilities/functions/utilities');

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

    async execute(interaction, auth, langOpt) {

        await interaction.deferReply({ ephemeral: true });

        const platform = interaction.options.get('platform').value;
        const player = interaction.options.getString('username');


        var url = encodeURI(`https://api.mozambiquehe.re/bridge?version=5&platform=${platform}&player=${player}&auth=${auth}`);
        fetch(url)
            .then(res => { if (res.status === 200) { return res.json() } else return sentErrorEmbed(interaction, langOpt, `stats.js l.38`) })
            .then(data => {
                if (!data || !data.global) return sentErrorEmbed(interaction, langOpt, 'WRONG USERNAME');

                var badge1 = data?.legends?.selected?.data[0] ?? "**-**";
                var badge2 = data?.legends?.selected?.data[1] ?? "**-**";
                var badge3 = data?.legends?.selected?.data[2] ?? "**-**";

                const accountCompletion = Math.floor((data.global.level / 500) * 100);
                var levelPrestige = data.global.levelPrestige
                var levelPrestigeProcent = Math.floor(((data.global.level + 500 * levelPrestige) / 2000) * 100);

                var battlepass = data.global.battlepass?.level?.toString() ?? "1";
                var battlepassCompletion = Math.floor((battlepass / 110) * 100);

                var status = getStatus(data.realtime);

                var statsEmbed = new EmbedBuilder()
                    .setTitle(`${emoji.logo[data.global.platform]} ${data.global.name}`)
                    .setDescription(`**Status:**${emoji.misc[status.color]}${status.state}`)
                    .addFields([
                        {
                            name: `${emoji.misc.level} Account`,
                            value: `${emoji.misc.grey_dot} Level ${data.global.level} (${accountCompletion}%)` +
                                `\n${emoji.misc.grey_dot} Prestige ${levelPrestige} (${levelPrestigeProcent}%)` +
                                `\n\n ** Battle Royale Ranked**` +
                                `\n${emoji.ranked[data.global.rank.rankName]} **${data.global.rank.rankName} ${data.global.rank.rankDiv}**` +
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
                            name: badge1.name,
                            value: badge1.value.toLocaleString(),
                            inline: true,
                        },
                        {
                            name: badge2.name,
                            value: badge2.value.toLocaleString(),
                            inline: true,
                        },
                        {
                            name: badge3.name,
                            value: badge3.value.toLocaleString(),
                            inline: true,
                        },
                    ])
                    .setImage(`https://cdn.jumpmaster.xyz/Bot/Legends/Banners/${data.legends.selected.LegendName}.png`)
                    .setColor(embedColor)
                    .setFooter({ text: `${lang[langOpt].stats.line_6}!` });

                interaction.editReply({ embeds: [statsEmbed], ephemeral: true });

            }).catch(error => { sentErrorEmbed(interaction, langOpt, error) })
    }
}