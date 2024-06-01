const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const firebase = require('firebase/app');
const { getFirestore, doc, getDoc, deleteDoc } = require('firebase/firestore');
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


module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlink')
        .setDMPermission(false)
        .setDescription('Unlink your Discord account from your Apex username.'),

    async execute(interaction, auth, langOpt) {

        await interaction.deferReply({ ephemeral: true });

        const docRef2 = doc(db, 'serverUsers', interaction.guild.id, 'users', interaction.user.id);
        const docSnap = await getDoc(docRef2);
        if (docSnap.exists()) {
            const docData = docSnap.data();
            deleteDoc(docRef2).then(() => {
                var unlinkedEmbed = new EmbedBuilder()
                    .setTitle(lang[langOpt].stats.line_5)
                    .setDescription(
                        `${lang[langOpt].stats.line_18}` +
                        `\n**${docData.username}** [${docData.platform}]`)
                    .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp()
                    .setColor("Red");

                interaction.editReply({ embeds: [unlinkedEmbed], ephemeral: true });
            }).catch(error => { return sentErrorEmbed(interaction, langOpt, error) })
        } else {

            var notLinkedEmbed = new EmbedBuilder()
                .setTitle(lang[langOpt].stats.line_1)
                .setDescription(`${lang[langOpt].stats.line_17}!`)
                .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp()
                .setColor("Red");

            interaction.editReply({ embeds: [notLinkedEmbed], ephemeral: true });
        }
    }
}
