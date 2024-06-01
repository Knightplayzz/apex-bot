const firebase = require('firebase/app')
const { getFirestore, doc, getDoc, deleteDoc, query, collection, getDocs } = require('firebase/firestore')
const { getAuth, signInWithEmailAndPassword, } = require('firebase/auth')
const email = process.env.email
const password = process.env.password
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

const setGuildCount = require("../../utilities/functions/setGuildCount");

module.exports = {
    name: "guildDelete",
    once: false,
    async execute(guildDelete, auth) {

        console.log(`${guildDelete.client.user.username} REMOVED: ${guildDelete.name} (${guildDelete.id})\nCount: Is being set.`)
        setGuildCount.execute(guild.client, auth);

        signInWithEmailAndPassword(fireAuth, email, password)
            .then(async (cred) => {
                const q2 = collection(db, "serverUsers", guildDelete.id, 'users');
                try {
                    const querySnapshot = await getDocs(q2);
                    querySnapshot.forEach(async (doc2) => { deleteDoc(doc2.ref) })
                } catch (err) { console.log(err) }
            }).catch(error => { console.log(error); })
    }
}