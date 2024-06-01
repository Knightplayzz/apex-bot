const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const firebase = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const firebaseConfig = {
    apiKey: "AIzaSyBJ12J-Q0HGEH115drMeCRKsPd_kt-Z68A",
    authDomain: "apex-discordbot.firebaseapp.com",
    databaseURL: "https://apex-discordbot-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "apex-discordbot",
    storageBucket: "apex-discordbot.appspot.com",
    messagingSenderId: "985625049043",
    appId: "1:985625049043:web:0401c7b6c4ceea7e516126",
    measurementId: "G-JSY0XDKC14"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);

const lang = require('../../../data/lang/lang.json');
const emoji = require('../../../data/utilities/emoji.json');
const { embedColor } = require('../../../data/utilities/utilities.json');
const { getStatus, sentErrorEmbed } = require('../../../utilities/functions/utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('me')
        .setDMPermission(false)
        .setDescription('Shows the stats of your linked Apex account.'),

    async execute(interaction, auth, langOpt) {

        await interaction.deferReply({ ephemeral: true });

        const docRef2 = doc(db, 'serverUsers', interaction.guild.id, 'users', interaction.user.id);
        const docSnap = await getDoc(docRef2);

        if (docSnap.exists()) {
            const docData = docSnap.data();
            const platform = docData.platform;
            const player = docData.username;

            var url = encodeURI(`https://api.mozambiquehe.re/bridge?version=5&platform=${platform}&player=${player}&auth=${auth}`);
            fetch(url)
                .then(res => {
                    if (res.status === 200) { return res.json() } else return sentErrorEmbed(interaction, langOpt, `me.js l.45`)
                })
                .then(data => {
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
}
