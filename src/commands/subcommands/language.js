const { EmbedBuilder } = require("discord.js");
const firebase = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const firebaseConfig = require('../../SECURITY/firebaseConfig.json');
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
const lang = require('../../data/lang/lang.json');


const languageSubCommand = (subCommand) => subCommand
    .setName('language')
    .setDescription('Change the language of the bot.')
    .setDescriptionLocalizations({
        nl: 'Verander de taal van de bot.'
    })
    .addStringOption(option =>
        option.setName('language')
            .setDescription('Select the language.')
            .setDescriptionLocalizations({
                nl: 'Kies een taal.'
            })
            .setRequired(true)
            .addChoices(
                { name: 'English (Default)', value: 'en' },
                { name: 'Dutch', value: 'nl' }
            ));


const languageSubFunction = async (interaction, auth, userData) => {

    await interaction.deferReply({ ephemeral: userData.invisible });

    var selecLang = interaction.options.get('language').value;

    await setDoc(doc(db, 'users', interaction.user.id), { lang: selecLang }, { merge: true });

    var langEmbed = new EmbedBuilder()
        .setTitle(`${lang[selecLang].lang.line_1}`)
        .setDescription(lang[selecLang].lang.line_2)
        .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp()
        .setColor(userData.embedColor);

    interaction.editReply({ embeds: [langEmbed], ephemeral: userData.invisible });

}

module.exports = {
    languageSubCommand: languageSubCommand,
    languageSubFunction: languageSubFunction
};
