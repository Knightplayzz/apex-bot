const firebase = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword, } = require('firebase/auth');
require('dotenv').config();
const email = process.env.email;
const password = process.env.password;
const firebaseConfig = require('../../SECURITY/firebaseConfig.json');
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
const fireAuth = getAuth();
const { sendVoteEmbed } = require('../../utilities/functions/utilities');
const { embedColor } = require('../../data/utilities/utilities.json');
const { hasUserPremium } = require('../../utilities/functions/hasUserPremium');

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, auth) {

        if (!interaction.isChatInputCommand()) return;

        const slashCommand = interaction.client.slashCommands.get(interaction.commandName);
        if (!slashCommand) return;

        var userData = { invisible: true, lang: 'en', embedColor: embedColor };
        const hasUserPremiumVar = await hasUserPremium(interaction);
        if (hasUserPremiumVar !== true && slashCommand.premium == true) return sendVoteEmbed(interaction, { invisible: true, lang: 'en', embedColor: embedColor });
        if (hasUserPremiumVar !== true) return slashCommand.execute(interaction, auth, userData);

        signInWithEmailAndPassword(fireAuth, email, password)
            .then(async (cred) => {
                const docSnap = await getDoc(doc(db, 'users', interaction.user.id))
                const data = docSnap.data()
                if (docSnap.exists()) userData = { invisible: data?.invisible ?? true, embedColor: data?.embedColor ?? embedColor, lang: data?.lang ?? 'en', username: data?.username ?? null, platform: data?.platform ?? null };
                slashCommand.execute(interaction, auth, userData);
            })
    }
}