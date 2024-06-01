const { EmbedBuilder } = require('discord.js');
const lang = require('../../data/lang/lang.json');
const firebase = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword, } = require('firebase/auth');
const email = process.env.email;
const password = process.env.password;
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
const fireAuth = getAuth();

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, auth) {
        if (interaction.isUserContextMenuCommand()) {
            const slashCommand = interaction.client.contextCommands.get(interaction.commandName);
            if (!slashCommand) return;
            let langOpt = 'en'

            var errorEmbed = new EmbedBuilder()
                .setDescription(`**${lang[langOpt].error.line_1}**` +
                    "```" + lang[langOpt].error.line_2 + "```")
                .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp()
                .setColor("Red");

            signInWithEmailAndPassword(fireAuth, email, password)
                .then(async (cred) => {
                    const docRef2 = doc(db, 'lang', interaction.user.id)
                    const docSnap = await getDoc(docRef2)
                    if (docSnap.exists()) {
                        const data = docSnap.data()
                        langOpt = data.lang
                    }
                    await slashCommand.execute(interaction, auth, langOpt);
                }).catch(error => {
                    console.log(error);
                    return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
                })
        }
    }
}

