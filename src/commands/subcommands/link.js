const { EmbedBuilder } = require("discord.js");
const fetch = require('node-fetch');
const firebase = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const firebaseConfig = require('../../SECURITY/firebaseConfig.json');
const lang = require('../../data/lang/lang.json');
const { handleError } = require('../../utilities/functions/utilities');
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);

const linkSubCommand = (subCommand) => subCommand
    .setName('link')
    .setDescription('Link your Discord account to your Apex Legends username.')
    .setDescriptionLocalizations({ nl: 'Koppel je Discord account aan je Apex Legends gebruikersnaam.' })
    .addStringOption(option =>
        option.setName('platform')
            .setDescription('The platform you play Apex on.')
            .setDescriptionLocalizations({ nl: 'Het platform waarop je Apex speelt.' })
            .setRequired(true)
            .addChoices(
                { name: 'PC(Steam/Origin)', value: 'PC' },
                { name: 'PlayStation', value: 'PS4' },
                { name: 'Xbox', value: 'X1' },
            ))
    .addStringOption(option =>
        option.setName('username')
            .setDescription('Your in-game username.')
            .setDescriptionLocalizations({ nl: 'Je in-game gebruikersnaam.' })
            .setRequired(true))

const linkSubFunction = async (interaction, auth, userData) => {

    var langOpt = userData.lang;
    await interaction.deferReply({ ephemeral: userData.invisible });

    var platform = interaction.options.get('platform').value
    const player = interaction.options.getString('username');

    if (userData.platform && userData.username) { //already linked

        var alreadyLinkedEmbed = new EmbedBuilder()
            .setTitle(`${lang[langOpt].link.line_1}`)
            .setDescription(
                `${lang[langOpt].link.line_2}:` +
                `\n**${userData.username}** [${userData.platform}]`)
            .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()
            .setColor("Red");

        return interaction.editReply({ embeds: [alreadyLinkedEmbed], ephemeral: userData.invisible });
    } else {
        var url = encodeURI(`https://api.mozambiquehe.re/bridge?version=5&platform=${platform}&player=${player}&auth=${auth}`);
        fetch(url)
            .then(res => {
                if (res.status === 200) { return res.json() } else {
                    handleError(interaction, userData, res.status)
                    return Promise.reject('Error occurred');
                }
            })
            .then(async data => {
                if (!data || !data?.global || !data?.global?.name || data?.global?.name === '') return sentLookUpError(interaction, userData);

                await setDoc(doc(db, 'users', interaction.user.id), {
                    platform: platform,
                    username: data.global.name
                }, { merge: true });

                var linkedEmbed = new EmbedBuilder()
                    .setTitle(`${lang[langOpt].link.line_3}`)
                    .setDescription(`${lang[langOpt].link.line_4}:` +
                        `\n**${data.global.name}** [${platform}]`)
                    .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp()
                    .setColor("Green");

                interaction.editReply({ embeds: [linkedEmbed], ephemeral: userData.invisible });
            }).catch(error => { console.error('Fetch error:', error) })
    }
}

module.exports = {
    linkSubCommand: linkSubCommand,
    linkSubFunction: linkSubFunction
};