const { EmbedBuilder } = require("discord.js");
const firebase = require('firebase/app');
const { getFirestore, doc, deleteDoc } = require('firebase/firestore');
const firebaseConfig = require('../../SECURITY/firebaseConfig.json');
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
const lang = require('../../data/lang/lang.json');
const { sentErrorEmbed } = require('../../utilities/functions/utilities');

module.exports = {
    async execute(interaction, userData, timers) {

        await interaction.deferUpdate();
        var langOpt = userData.lang;

        if (timers[interaction.message.interaction.id]) clearTimeout(timers[interaction.message.interaction.id]);
        if (interaction.customId === "1") {
            await deleteDoc(doc(db, 'users', interaction.user.id))
                .then(() => {
                    var succesEmbed = new EmbedBuilder()
                        .setTitle(`${lang[langOpt].settings.line_7}`)
                        .setColor('Green')

                    interaction.editReply({ embeds: [succesEmbed], components: [], ephemeral: userData.invisible })
                })
                .catch((error) => {
                    sentErrorEmbed(interaction, userData)
                    return console.log(error)
                });
        } else {
            var cancelledEmbed = new EmbedBuilder()
                .setTitle(`${lang[langOpt].settings.line_8}`)
                .setColor('Red')
            interaction.editReply({ embeds: [cancelledEmbed], components: [], ephemeral: userData.invisible });
        }
    }
}