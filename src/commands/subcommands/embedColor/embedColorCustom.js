const { EmbedBuilder } = require("discord.js");
const firebase = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const firebaseConfig = require('../../../SECURITY/firebaseConfig.json');
const lang = require('../../../data/lang/lang.json');
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
const colorList = require('../../../data/utilities/colors/list.json');

const embedColorCustomSubCommand = (subCommand) => subCommand
    .setName('custom')
    .setDescription('Set a custom embed color.')
    .addStringOption(option =>
        option
            .setName('color')
            .setDescription('Choose your color (hex colors are supported).')
            .setDescriptionLocalizations({ nl: 'kies een kleur (hex kleuren zijn ook ondersteund).' })
            .setAutocomplete(true)
    );

async function embedColorCustomAutocomplete(interaction) {

    const focusedValue = interaction.options.getFocused();
    const filtered = colorList.filter(choice => choice.name.toLowerCase().includes(focusedValue.toLowerCase()));
    const limitedChoices = filtered.slice(0, 25);

    await interaction.respond(limitedChoices.map(choice => ({ name: choice.name, value: choice.value })));
}

const embedColorCustomSubFunction = async (interaction, userData) => {

    const langOpt = userData.lang;

    var colorEmbed = new EmbedBuilder()
        .setTitle(lang[langOpt].settings.line_1)
        .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

    var option = interaction.options.getString('color');

    const validColors = colorList.map(choice => choice.value);

    const errorEmbed = new EmbedBuilder()
        .setTitle('ERROR')
        .setDescription(lang[langOpt].settings.line_10)
        .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
        .setColor('Red')
        .setTimestamp();

    const hexString = option.startsWith('#') ? option : '#' + option;
    if (isHexColor(hexString)) { option = hexString }
    else if (!validColors.includes(option)) return interaction.editReply({ embeds: [errorEmbed], ephemeral: userData.invisible });

    await setDoc(doc(db, 'users', interaction.user.id), { embedColor: option }, { merge: true });

    const colorName = getColorName(option);
    colorEmbed
        .setDescription(`${lang[langOpt].settings.line_3} \`${colorName}\`.`)
        .setColor(option);

    await interaction.editReply({ embeds: [colorEmbed], ephemeral: userData.invisible });
};

function isHexColor(str) {
    const hexColorPattern = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
    return hexColorPattern.test(str);
}

const getColorName = (value) => {
    const choice = colorList.find(choice => choice.value === value);
    return choice ? choice.name : value;
};

module.exports = {
    embedColorCustomSubCommand,
    embedColorCustomSubFunction,
    autocomplete: embedColorCustomAutocomplete
};