const firebase = require('firebase/app');
const { getFirestore, doc, getDoc, deleteDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword, } = require('firebase/auth');
const email = process.env.email;
const password = process.env.password;
const firebaseConfig = require('../../SECURITY/firebaseConfig.json')

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