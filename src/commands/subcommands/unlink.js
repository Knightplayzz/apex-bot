const { EmbedBuilder } = require('discord.js');
const firebase = require('firebase/app');
const { getFirestore, updateDoc, deleteField, doc } = require('firebase/firestore');
const firebaseConfig = require('../../SECURITY/firebaseConfig.json');
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
const lang = require('../../data/lang/lang.json');

const unlinkSubCommand = (subCommand) => subCommand.setName('unlink')
    .setDescription('Unlink your Discord account from your Apex username.')
    .setDescriptionLocalizations({ nl: 'Ontkoppel je Discord account van je Apex gebruikersnaam.' });

const unlinkSubFunction = async (interaction, userData) => {

    const langOpt = userData.lang;

    const unlinkedEmbed = new EmbedBuilder()
        .setTitle(lang[langOpt].stats.line_5)
        .setDescription(
            `${lang[langOpt].stats.line_18}` +
            `\n**${userData.username}** [${userData.platform}]`)
        .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp()
        .setColor("Green");

    const notLinkedEmbed = new EmbedBuilder()
        .setTitle(lang[langOpt].stats.line_1)
        .setDescription(`${lang[langOpt].stats.line_17}!`)
        .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp()
        .setColor("Red");

    if (userData.platform && userData.username) {
        await updateDoc(doc(db, 'users', interaction.user.id), { 'platform': deleteField(), 'username': deleteField() })
            .then(interaction.editReply({ embeds: [unlinkedEmbed], ephemeral: userData.invisible })) //Check of deze activeerd
            .catch(error => { return sendErrorEmbed(interaction, langOpt, error) });
    } else return interaction.editReply({ embeds: [notLinkedEmbed], ephemeral: userData.invisible });
}

module.exports = {
    unlinkSubCommand: unlinkSubCommand,
    unlinkSubFunction: unlinkSubFunction
};