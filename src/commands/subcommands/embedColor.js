const { EmbedBuilder } = require("discord.js");
const firebase = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const firebaseConfig = require('../../SECURITY/firebaseConfig.json')
const lang = require('../../data/lang/lang.json');
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
const { embedColor } = require('../../data/utilities/utilities.json')

const embedColorSubComand = (subCommand) => subCommand
    .setName('embedcolor')
    .setDescription('select a collor for an embed')
    .addStringOption(option =>
        option.setName('option')
            .setDescription('Select a option.')
            .setDescriptionLocalizations({ nl: 'maak een keuze.' })
            .setRequired(true)
            .addChoices(
                { name: 'Default', value: embedColor },
                { name: 'Yellow', value: 'Yellow' },
                { name: 'Red', value: 'Red' },
                { name: 'Green', value: 'Green' },
                { name: 'Blue', value: 'Blue' },
                { name: 'Random', value: 'Random' },
            ));

const embedColorSubFunction = async (interaction, auth, userData) => {

    await interaction.deferReply({ ephemeral: userData.invisible });

    var option = interaction.options.get('option').value;
    var langOpt = userData.lang;
    await setDoc(doc(db, 'users', interaction.user.id), { embedColor: option }, { merge: true });

    var embed = new EmbedBuilder()
        .setTitle(`${lang[langOpt].settings.line_1}`)
        .setDescription(lang[langOpt].settings.line_3 + "``" + option + "``.")
        .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp()
        .setColor(option);

    interaction.editReply({ embeds: [embed], ephemeral: userData.invisible });
}

module.exports = {
    embedColorSubComand: embedColorSubComand,
    embedColorSubFunction: embedColorSubFunction
};