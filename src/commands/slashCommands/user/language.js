const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const firebase = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDoc, deleteDoc } = require('firebase/firestore');
const firebaseConfig = require('../../../SECURITY/firebaseConfig.json');
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
const lang = require('../../../data/lang/lang.json');
const { sentErrorEmbed } = require('../../../utilities/functions/utilities');
const { embedColor } = require('../../../data/utilities/utilities.json');

module.exports = {
    premium: true,
    data: new SlashCommandBuilder()
        .setName('language')
        .setDescription('Change the language of the bot.')
        .setDescriptionLocalizations({
            nl: 'Verander de taal van de bot.'
        })
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('language')
                .setDescription('Select the language.')
                .setDescriptionLocalizations({
                    nl: 'Kies een taal.'
                })
                .setRequired(true)
                .addChoices(
                    { name: 'English (Default)', value: 'en' },
                    { name: 'Dutch', value: 'nl' },
                    { name: 'Unlink', value: 'unlink' },
                )),


    async execute(interaction, auth, langOpt) {

        await interaction.deferReply({ ephemeral: true });

        var selecLang = interaction.options.get('language').value;

        if (selecLang === 'unlink') {
            const docRef2 = doc(db, 'lang', interaction.user.id);
            const docSnap = await getDoc(docRef2);
            if (docSnap.exists()) {
                deleteDoc(docRef2).then(() => {
                    var deleteEmbed = new EmbedBuilder()
                        .setTitle("YOU ARE NOW UNLINKED")
                        .setDescription(`You are removed from our database.` +
                            "\nLanguage has been set to: ``English/Default``")
                        .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                        .setTimestamp()
                        .setColor("Red");
                    interaction.editReply({ embeds: [deleteEmbed], ephemeral: true });
                }).catch(error => {
                    console.log(error); //FAILED TO DELETE DATA
                    return sentErrorEmbed(interaction, langOpt);
                })
            } else {
                var noLangEmbed = new EmbedBuilder()
                    .setTitle("ERROR")
                    .setDescription(`You don't have a language set.` +
                        "\nLanguage: ``English / default``")
                    .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp()
                    .setColor("Red");

                interaction.editReply({ embeds: [noLangEmbed], ephemeral: true });
            }

        } else {
            const citiesRef = collection(db, 'lang');
            await setDoc(doc(citiesRef, interaction.user.id), {
                lang: selecLang
            });
            var langEmbed = new EmbedBuilder()
                .setTitle(`${lang[selecLang].lang.line_1}`)
                .setDescription(lang[selecLang].lang.line_2)
                .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp()
                .setColor(embedColor);

            interaction.editReply({ embeds: [langEmbed], ephemeral: true });
        }
    }
}
