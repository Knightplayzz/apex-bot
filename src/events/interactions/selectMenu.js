const { EmbedBuilder } = require('discord.js');
const timers = {};
const lang = require('../../data/lang/lang.json');
const firebase = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword, } = require('firebase/auth');
const email = process.env.email;
const password = process.env.password;
const firebaseConfig = require('../../SECURITY/firebaseConfig.json')

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
const fireAuth = getAuth();

//const heirloomFile = require('../../utilities/eventCommands/heirloom.js');
const loadoutFile = require('../../utilities/eventCommands/loadout.js');
//const bugFile = require('../../utilities/eventCommands/bug.js');

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, auth) {

        if (!interaction.isStringSelectMenu()) return;

        let langOpt = 'en'

        signInWithEmailAndPassword(fireAuth, email, password)
            .then(async (cred) => {
                const docRef2 = doc(db, 'lang', interaction.user.id);
                const docSnap = await getDoc(docRef2);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    langOpt = data.lang;
                }
            }).catch(error => { console.log(error) });

        // if (interaction.isCommand()) {
        //     if (interaction.commandName === 'heirloom') {
        //         const data = interaction.options.data
        //         if (data[0] === undefined) {
        //             timers[interaction.id] = setTimeout(() => {
        //                 var botEmbed = new EmbedBuilder()
        //                     .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
        //                     .setTitle(`${lang[langOpt].heirloom.line_2}!`)
        //                     .setTimestamp()
        //                 interaction.editReply({ embeds: [botEmbed], components: [] })
        //             }, 15000);
        //         } else {
        //             timers[interaction.id] = setTimeout(() => {
        //                 interaction.editReply({ components: [] })
        //             }, 15000);
        //         }
        //     } else return;
        // }

        //if (interaction.customId === 'heirlooms') heirloomFile.execute(interaction, langOpt, timers);
        if (interaction.customId === 'loadout') loadoutFile.execute(interaction, langOpt);
        //if (interaction.customId === 'bug') bugFile.execute(interaction, langOpt);
    }
}