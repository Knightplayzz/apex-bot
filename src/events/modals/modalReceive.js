const { EmbedBuilder } = require('discord.js');
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
    async execute(interaction, auth, lang) {
        if (!interaction.isModalSubmit()) return;
        let langOpt = 'en'

        signInWithEmailAndPassword(fireAuth, email, password)
            .then(async (cred) => {
                const docRef2 = doc(db, 'lang', interaction.user.id)
                const docSnap = await getDoc(docRef2)
                if (docSnap.exists()) {
                    const data = docSnap.data()
                    langOpt = data.lang
                }
            }).then(res => {
                if (res.status === 200) { return res.json() } else {
                    return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
                }

            }).catch(error => {
                console.log(error)
                return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            })


        const bug = interaction.fields.getTextInputValue('messageInput');
        const title = interaction.fields.getTextInputValue('commandInput');

        let botEmbed = new EmbedBuilder()
            .setTitle(lang[langOpt].report.line_9)
            .setDescription(`${lang[langOpt].report.line_10}.`)
            .setFooter({ text: `${client.user.username} ❤️`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp()

        interaction.reply({ embeds: [botEmbed], ephemeral: true });

        try {
            const logServ = client.guilds.cache.get('1018244995792257114')
            const logChan = logServ.channels.cache.find(channel => channel.name === "log-report")

            let botEmbed = new EmbedBuilder()
                .setTitle(`BUG: ${title}`)
                .setDescription(bug)
                .setFooter({ text: `${client.user.username} ❤️`, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()


            logChan.send({ embeds: [botEmbed] })
        } catch {
            console.log("BUG CHANNEL NOT FOUND")
            console.log(title)
            console.log(bug)
        }
    }
}