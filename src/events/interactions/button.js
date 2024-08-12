const { EmbedBuilder } = require("discord.js");
const firebase = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword, } = require('firebase/auth');
const email = process.env.email;
const password = process.env.password;
const firebaseConfig = require('../../SECURITY/firebaseConfig.json');
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
const fireAuth = getAuth();
const { embedColor } = require('../../data/utilities/utilities.json');
const timers = {};
const lang = require('../../data/lang/lang.json');
//const shopFile = require('../../utilities/eventCommands/shop.js');
const newsFile = require('../../utilities/eventCommands/news.js');
const settingsDelete = require('../../utilities/eventCommands/settings-delete.js');
const { hasUserPremium } = require('../../utilities/functions/hasUserPremium.js');

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, auth) {

        if (!interaction.isCommand() && !interaction.isButton()) return;

        var userData = { invisible: true, lang: 'en', embedColor: embedColor };
        const hasUserPremiumVar = await hasUserPremium(interaction);

        signInWithEmailAndPassword(fireAuth, email, password)
            .then(async (cred) => {
                const docSnap = await getDoc(doc(db, 'users', interaction.user.id))
                const data = docSnap.data()
                if (docSnap.exists() && hasUserPremiumVar === true) userData = { invisible: data?.invisible ?? true, embedColor: data?.embedColor ?? embedColor, lang: data?.lang ?? 'en', username: data?.username ?? null, platform: data?.platform ?? null };

                var langOpt = userData.lang;
                var cancelledEmbed = new EmbedBuilder()
                    .setTitle(`${lang[langOpt].settings.line_8}`)
                    .setDescription(`${lang[langOpt].settings.line_9}`)
                    .setColor('Red');

                if (interaction.isCommand() && hasUserPremiumVar === true) {
                    if (interaction.options.getSubcommand(false) === 'delete') return timers[interaction.id] = setTimeout(() => { interaction.editReply({ embeds: [cancelledEmbed], components: [], ephemeral: userData.invisible }) }, 15 * 1000);
                }
                if (interaction.commandName === 'news') timers[interaction.id] = setTimeout(() => { interaction.editReply({ components: [], ephemeral: userData.invisible }) }, 15 * 1000);
                if (!interaction.isButton()) return
                if (interaction.message.interaction.commandName === 'news') {
                    if (timers[interaction.message.interaction.id]) clearTimeout(timers[interaction.message.interaction.id]);
                    timers[interaction.message.interaction.id] = setTimeout(async () => { interaction.editReply({ components: [], ephemeral: userData.invisible }) }, 15 * 1000);
                }
                if (interaction.user.id !== interaction.message.interaction.user.id) return interaction.reply({ content: "Not your button!", ephemeral: true });
                if (interaction.message.interaction.commandName === "settings delete") settingsDelete.execute(interaction, userData, timers);
                if (interaction.message.interaction.commandName === 'news') newsFile.execute(interaction, auth, userData);
                //if (interaction.message.interaction.commandName === 'shop') shopFile.execute(interaction, auth, userData);
            })
    }
}