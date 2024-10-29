const { EmbedBuilder } = require("discord.js");
const firebase = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const firebaseConfig = require('../../SECURITY/firebaseConfig.json');
const lang = require('../../data/lang/lang.json');
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);

const messageSubCommand = (subCommand) => subCommand
    .setName('message')
    .setDescription('Weather the message is visible or not.')
    .addStringOption(option =>
        option.setName('option')
            .setDescription('Select is message is visible or not.')
            .setDescriptionLocalizations({ nl: 'Kies of bericht zichtbaar moet zijn of niet.' })
            .setRequired(true)
            .addChoices(
                { name: 'visible', value: 'visible' },
                { name: 'invisible', value: 'invisible' },
            ));

const messageSubFunction = async (interaction, userData) => {

    var langOpt = userData.lang;

    var option = interaction.options.get('option').value;
    var isInvisibleBoolean = (option === "invisible");

    await interaction.deferReply({ ephemeral: isInvisibleBoolean });
    await setDoc(doc(db, 'users', interaction.user.id), { invisible: isInvisibleBoolean }, { merge: true });

    var embed = new EmbedBuilder()
        .setTitle(`${lang[langOpt].settings.line_1}`)
        .setDescription(lang[langOpt].settings.line_2 + "``" + option + "``.")
        .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp()
        .setColor(userData.embedColor);

    interaction.editReply({ embeds: [embed], ephemeral: isInvisibleBoolean });
}

module.exports = {
    messageSubCommand: messageSubCommand,
    messageSubFunction: messageSubFunction
};