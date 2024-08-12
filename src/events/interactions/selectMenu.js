const firebase = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword, } = require('firebase/auth');
const email = process.env.email;
const password = process.env.password;
const firebaseConfig = require('../../SECURITY/firebaseConfig.json');
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
const fireAuth = getAuth();
const loadoutFile = require('../../utilities/eventCommands/loadout.js');
const { embedColor } = require('../../data/utilities/utilities.json');

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction) {

        if (!interaction.isStringSelectMenu()) return;

        var userData = { invisible: true, lang: 'en', embedColor: embedColor };
        signInWithEmailAndPassword(fireAuth, email, password)
            .then(async (cred) => {
                const docSnap = await getDoc(doc(db, 'users', interaction.user.id));
                const data = docSnap.data();
                if (docSnap.exists()) userData = { invisible: data?.invisible ?? true, embedColor: data?.embedColor ?? embedColor, lang: data?.lang ?? 'en', username: data?.username ?? null, platform: data?.platform ?? null }
                if (interaction.customId === 'loadout') loadoutFile.execute(interaction, userData);
            }).catch(error => { console.log(error) });
    }
}