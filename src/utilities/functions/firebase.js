const { initializeApp, getApp, getApps } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { doc, getDoc, getFirestore } = require('firebase/firestore');
const { embedColor } = require('../../data/utilities/utilities.json');
const logger = require('./logger').child({ module: 'firebase' });

const DEFAULT_USER_DATA = Object.freeze({
    invisible: true,
    lang: 'en',
    embedColor,
    username: null,
    platform: null,
});

let firebaseConfig;
let firebaseConfigError;
try {
    firebaseConfig = require('../../SECURITY/firebaseConfig.json');
} catch (error) {
    firebaseConfigError = error;
}

let app;
let db;
let auth;
let signInPromise;

function assertFirebaseConfig() {
    if (!firebaseConfig) {
        throw new Error(
            `Missing Firebase config at src/SECURITY/firebaseConfig.json: ${firebaseConfigError?.message || 'unknown error'}`
        );
    }
}

function getFirebaseApp() {
    assertFirebaseConfig();
    if (!app) app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    return app;
}

function getDb() {
    if (!db) db = getFirestore(getFirebaseApp());
    return db;
}

function getFirebaseAuth() {
    if (!auth) auth = getAuth(getFirebaseApp());
    return auth;
}

async function ensureSignedIn() {
    const firebaseAuth = getFirebaseAuth();
    if (firebaseAuth.currentUser) return firebaseAuth.currentUser;

    if (!process.env.email || !process.env.password) {
        throw new Error('Missing Firebase auth environment variables: email and/or password.');
    }

    if (!signInPromise) {
        signInPromise = signInWithEmailAndPassword(
            firebaseAuth,
            process.env.email,
            process.env.password
        )
            .then(credential => {
                logger.info('Firebase sign-in succeeded', { uid: credential.user.uid });
                return credential.user;
            })
            .catch(error => {
                signInPromise = null;
                throw error;
            });
    }

    return signInPromise;
}

function normalizeUserData(data = {}) {
    return {
        invisible: data?.invisible ?? DEFAULT_USER_DATA.invisible,
        lang: data?.lang ?? DEFAULT_USER_DATA.lang,
        embedColor: data?.embedColor ?? DEFAULT_USER_DATA.embedColor,
        username: data?.username ?? DEFAULT_USER_DATA.username,
        platform: data?.platform ?? DEFAULT_USER_DATA.platform,
    };
}

async function getUserData(userId) {
    await ensureSignedIn();
    const snapshot = await getDoc(doc(getDb(), 'users', userId));
    return snapshot.exists() ? normalizeUserData(snapshot.data()) : normalizeUserData();
}

module.exports = {
    DEFAULT_USER_DATA,
    ensureSignedIn,
    getDb,
    getFirebaseAuth,
    getFirebaseApp,
    getUserData,
    normalizeUserData,
};
