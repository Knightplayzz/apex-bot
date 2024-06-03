const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require('node-fetch');
const firebase = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDoc } = require('firebase/firestore');
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

const lang = require('../../../data/lang/lang.json');
const { sentErrorEmbed } = require('../../../utilities/functions/utilities');
const { embedColor } = require('../../../data/utilities/utilities.json')
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);


module.exports = {
    premium: true,
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Link your Discord account to your Apex Legends username.')
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('platform')
                .setDescription('The platform you play Apex on.')
                .setRequired(true)
                .addChoices(
                    { name: 'PC(Steam/Origin)', value: 'PC' },
                    { name: 'PlayStation', value: 'PS4' },
                    { name: 'Xbox', value: 'X1' },
                ))
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Your in-game username.')
                .setRequired(true)
        ),

    async execute(interaction, auth, langOpt) {

        await interaction.deferReply({ ephemeral: true })

        var platform = interaction.options.get('platform').value
        const player = interaction.options.getString('username');

        const docRef2 = doc(db, 'serverUsers', interaction.guild.id, 'users', interaction.user.id);
        const docSnap = await getDoc(docRef2);
        if (docSnap.exists()) {
            const data = docSnap.data()
            var alreadyLinkedEmbed = new EmbedBuilder()
                .setTitle(`${lang[langOpt].link.line_1}`)
                .setDescription(
                    `${lang[langOpt].link.line_2}:` +
                    `\n**${data.username}** [${data.platform}]`)
                .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp()
                .setColor("Red");

            return interaction.editReply({ embeds: [alreadyLinkedEmbed], ephemeral: true });
        } else {

            var url = encodeURI(`https://api.mozambiquehe.re/bridge?version=5&platform=${platform}&player=${player}&auth=${auth}`);
            fetch(url)
                .then(res => {
                    if (res.status === 200) { return res.json() } else return sentErrorEmbed(interaction, langOpt, `link.js l.69`)
                }).then(async data => {
                    if (!data || !data?.global || !data?.global?.name || data?.global?.name === '') return sentErrorEmbed(interaction, langOpt, `link.js l.73`);

                    const citiesRef = collection(db, 'serverUsers', interaction.guild.id, 'users');
                    await setDoc(doc(citiesRef, interaction.user.id), {
                        platform: platform,
                        username: data.global.name
                    });
                    var linkedEmbed = new EmbedBuilder()
                        .setTitle(`${lang[langOpt].link.line_3}`)
                        .setDescription(`${lang[langOpt].link.line_4}:` +
                            `\n**${data.global.name}** [${platform}]`)
                        .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                        .setTimestamp()
                        .setColor(embedColor);

                    interaction.editReply({ embeds: [linkedEmbed], ephemeral: true });
                }).catch(error => { sentErrorEmbed(interaction, langOpt, error); })
        }
    }
}
