const { EmbedBuilder } = require('discord.js');
const { doc, setDoc } = require('firebase/firestore');
const lang = require('../../data/lang/lang.json');
const { getDb } = require('../../utilities/functions/firebase');

const languageSubCommand = subCommand =>
    subCommand
        .setName('language')
        .setDescription('Change the language of the bot.')
        .setDescriptionLocalizations({ nl: 'Verander de taal van de bot.' })
        .addStringOption(option =>
            option
                .setName('language')
                .setDescription('Select the language.')
                .setDescriptionLocalizations({ nl: 'Kies een taal.' })
                .setRequired(true)
                .addChoices(
                    { name: 'English (Default)', value: 'en' },
                    { name: 'Dutch', value: 'nl' }
                )
        );

const languageSubFunction = async (interaction, userData) => {
    const selecLang = interaction.options.get('language').value;

    await setDoc(doc(getDb(), 'users', interaction.user.id), { lang: selecLang }, { merge: true });

    const langEmbed = new EmbedBuilder()
        .setTitle(`${lang[selecLang].lang.line_1}`)
        .setDescription(lang[selecLang].lang.line_2)
        .setFooter({
            text: `${interaction.client.user.username} :heart:`,
            iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setTimestamp()
        .setColor(userData.embedColor);

    return interaction.editReply({ embeds: [langEmbed], ephemeral: userData.invisible });
};

module.exports = {
    languageSubCommand,
    languageSubFunction,
};
