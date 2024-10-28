const { EmbedBuilder } = require("discord.js");
const firebase = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const firebaseConfig = require('../../SECURITY/firebaseConfig.json');
const lang = require('../../data/lang/lang.json');
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
const { embedColor } = require('../../data/utilities/utilities.json');

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
                { name: "White", value: "White" },
                { name: 'Yellow', value: 'Yellow' },
                { name: 'Orange', value: 'orange' },
                { name: 'Red', value: 'Red' },
                { name: 'Green', value: 'Green' },
                { name: 'Blue', value: 'Blue' },
                { name: 'Random', value: 'Random' },
                { name: 'Custom', value: 'Custom' }
            ))
    .addStringOption(option =>
        option.setName('color')
            .setDescription('Choose your color in hex.')
            .setDescriptionLocalizations({ nl: 'kies je kleur in hex.' })
            .setRequired(false));

const embedColorSubFunction = async (interaction, auth, userData) => {

    const langOpt = userData.lang;

    await interaction.deferReply({ ephemeral: userData.invisible });

    var colorEmbed = new EmbedBuilder()
        .setTitle(`${lang[langOpt].settings.line_1}`)
        .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp()

    var option = interaction.options.get('option').value;
    var customColor = interaction.options?.getString('color');
    if (customColor && !customColor.startsWith('#')) customColor = '#' + customColor;

    if (option === "Custom") {
        if (isHexColor(customColor) == true) {
            await setDoc(doc(db, 'users', interaction.user.id), { embedColor: customColor }, { merge: true });
            colorEmbed.setDescription(lang[langOpt].settings.line_3 + "``" + customColor + "``.")
                .setColor(customColor);
        } else {
            var errorEmbed = new EmbedBuilder()
                .setTitle('ERROR')
                .setDescription(lang[langOpt].settings.line_10)
                .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                .setColor('Red')
                .setTimestamp()

            return interaction.editReply({ embeds: [errorEmbed], ephemeral: userData.invisible });
        }
    } else {
        await setDoc(doc(db, 'users', interaction.user.id), { embedColor: option }, { merge: true });
        colorEmbed.setDescription(lang[langOpt].settings.line_3 + "``" + option + "``.")
            .setColor(option);
    }

    interaction.editReply({ embeds: [colorEmbed], ephemeral: userData.invisible });
}

function isHexColor(str) {
    const hexColorPattern = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
    return hexColorPattern.test(str);
}

module.exports = {
    embedColorSubComand: embedColorSubComand,
    embedColorSubFunction: embedColorSubFunction
};