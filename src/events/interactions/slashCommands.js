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

const { hasUserVoted, sentVoteEmbed } = require('../../utilities/functions/utilities');

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, auth) {
        if (interaction.isChatInputCommand()) {

            const slashCommand = interaction.client.slashCommands.get(interaction.commandName);
            if (!slashCommand) return;

            var langOpt = 'en';
            signInWithEmailAndPassword(fireAuth, email, password)
                .then(async (cred) => {
                    const docSnap = await getDoc(doc(db, 'lang', interaction.user.id))
                    if (docSnap.exists()) langOpt = docSnap.data().lang;
                }).catch(error => { console.log(error) });

            // let skus = await interaction.client.application.fetchSKUs();
            // console.log(skus);
            // interaction.client.application.entitlements.createTest({ guild: interaction.guild, sku: skus.get('1246772758541631518') })

            //CHECK IF SLASH COMMAND NEEDS PREMIUM
            if (slashCommand.premium == true) {
                var isServerPremium, isUserPremium;
                const entitlements = await interaction.client.application.entitlements.fetch(interaction.guild);
                const userEntitlements = await interaction.client.application.entitlements.fetch(interaction.user);
                userEntitlements.forEach(async data => { if (data.skuId === '1246777340806303866' && data.userId === interaction.user.id) isUserPremium = true }); //|| data.skuId === '1014207340188270673' THIS IS USER SUBSCRIPTION
                entitlements.forEach(async data => { if (data.skuId === '1247194389281902683' && data.guildId === interaction.guild.id || data.skuId === '1246772758541631518' && data.guildId === interaction.guild.id) isServerPremium = true; }) //LIFETIME 1247194389281902683| sub 1246772758541631518
                if (isServerPremium == undefined && isUserPremium == undefined) {
                    let hasUserVotedVar = await hasUserVoted(interaction, langOpt);
                    if (hasUserVotedVar == true) return await slashCommand.execute(interaction, auth, langOpt)
                    if (hasUserVotedVar == false) return sentVoteEmbed(interaction, langOpt); //to ensure when error happends it doesnt send 2 embeds and crashes
                } else await slashCommand.execute(interaction, auth, langOpt);
            } else await slashCommand.execute(interaction, auth, langOpt);
        }
    }
}