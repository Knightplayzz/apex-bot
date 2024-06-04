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

const shopFile = require('../../utilities/eventCommands/shop.js');
const newsFile = require('../../utilities/eventCommands/news.js');

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, auth) {
        if (!interaction.isButton()) return

        var langOpt = 'en';

        signInWithEmailAndPassword(fireAuth, email, password)
            .then(async (cred) => {
                const docRef2 = doc(db, 'lang', interaction.user.id);
                const docSnap = await getDoc(docRef2);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    langOpt = data.lang
                }
            }).catch(error => { console.log(error); })

        if (interaction.message.interaction.commandName === 'shop') shopFile.execute(interaction, auth, langOpt)
        if (interaction.message.interaction.commandName === 'news') newsFile.execute(interaction, auth, langOpt)
    }
}