const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const firebase = require('firebase/app');
const { getFirestore, doc, getDoc, deleteDoc } = require('firebase/firestore');
const firebaseConfig = require('../../../SECURITY/firebaseConfig.json')

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
const lang = require('../../../data/lang/lang.json');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlink')
        .setDMPermission(false)
        .setDescription('Unlink your Discord account from your Apex username.')
        .setDescriptionLocalizations({
            nl: 'Ontkoppel je Discord account van je Apex gebruikersnaam.'
        }),

    async execute(interaction, auth, langOpt) {

        await interaction.deferReply({ ephemeral: true });

        const docRef2 = doc(db, 'serverUsers', interaction.guild.id, 'users', interaction.user.id);
        const docSnap = await getDoc(docRef2);
        if (docSnap.exists()) {
            const docData = docSnap.data();
            deleteDoc(docRef2).then(() => {
                var unlinkedEmbed = new EmbedBuilder()
                    .setTitle(lang[langOpt].stats.line_5)
                    .setDescription(
                        `${lang[langOpt].stats.line_18}` +
                        `\n**${docData.username}** [${docData.platform}]`)
                    .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp()
                    .setColor("Red");

                interaction.editReply({ embeds: [unlinkedEmbed], ephemeral: true });
            }).catch(error => { return sentErrorEmbed(interaction, langOpt, error) })
        } else {

            var notLinkedEmbed = new EmbedBuilder()
                .setTitle(lang[langOpt].stats.line_1)
                .setDescription(`${lang[langOpt].stats.line_17}!`)
                .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp()
                .setColor("Red");

            interaction.editReply({ embeds: [notLinkedEmbed], ephemeral: true });
        }
    }
}
