//const timers = {};
const firebase = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword, } = require('firebase/auth');
const email = process.env.email;
const password = process.env.password;
const firebaseConfig = require('../../SECURITY/firebaseConfig.json')
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
const fireAuth = getAuth();
//const heirloomFile = require('../../utilities/eventCommands/heirloom.js');
const loadoutFile = require('../../utilities/eventCommands/loadout.js');
//const bugFile = require('../../utilities/eventCommands/bug.js');
const { embedColor } = require('../../data/utilities/utilities.json');

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, auth) {

        if (!interaction.isStringSelectMenu()) return;

        var userData = { invisible: true, lang: 'en', embedColor: embedColor };
        signInWithEmailAndPassword(fireAuth, email, password)
            .then(async (cred) => {
                const docSnap = await getDoc(doc(db, 'users', interaction.user.id));
                const data = docSnap.data();
                if (docSnap.exists()) userData = { invisible: data?.invisible ?? true, embedColor: data?.embedColor ?? embedColor, lang: data?.lang ?? 'en', username: data?.username ?? null, platform: data?.platform ?? null }



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

                //if (interaction.customId === 'heirlooms') heirloomFile.execute(interaction, userData, timers);
                if (interaction.customId === 'loadout') loadoutFile.execute(interaction, userData);
                //if (interaction.customId === 'bug') bugFile.execute(interaction, userData);
            }).catch(error => { console.log(error) });
    }
}