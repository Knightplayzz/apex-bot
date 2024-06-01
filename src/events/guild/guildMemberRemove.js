const firebase = require('firebase/app');
const { getFirestore, doc, getDoc, deleteDoc } = require('firebase/firestore');
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
    name: "guildMemberRemove",
    once: false,
    async execute(member) {

        signInWithEmailAndPassword(fireAuth, email, password)
            .then(async (cred) => {
                const docRef3 = doc(db, 'serverUsers', member.guild.id, 'users', member.user.id);
                const docSnap2 = await getDoc(docRef3);

                if (!docSnap2.exists()) return
                deleteDoc(docRef3).then(() => { console.log(`Succesfully deleted: ${member.user.username} from db.`) })
                    .catch(error => { console.log(error); })
            })
    }
}