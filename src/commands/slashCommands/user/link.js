const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require('node-fetch');
const firebase = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDoc } = require('firebase/firestore');
const firebaseConfig = require('../../../SECURITY/firebaseConfig.json')

const lang = require('../../../data/lang/lang.json');
const { handleError } = require('../../../utilities/functions/utilities');
const { embedColor } = require('../../../data/utilities/utilities.json')
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);


module.exports = {
    premium: true,
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Link your Discord account to your Apex Legends username.')
        .setDescriptionLocalizations({
            nl: 'Koppel je Discord account aan je Apex Legends gebruikersnaam.'
        })
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('platform')
                .setDescription('The platform you play Apex on.')
                .setDescriptionLocalizations({
                    nl: 'Het platform waarop je Apex speelt.'
                })
                .setRequired(true)
                .addChoices(
                    { name: 'PC(Steam/Origin)', value: 'PC' },
                    { name: 'PlayStation', value: 'PS4' },
                    { name: 'Xbox', value: 'X1' },
                ))
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Your in-game username.')
                .setDescriptionLocalizations({
                    nl: 'Je in-game gebruikersnaam.'
                })
                .setRequired(true)
        ),

    async execute(interaction, auth, langOpt) {

        await interaction.deferReply({ ephemeral: true })

        var platform = interaction.options.get('platform').value
        const player = interaction.options.getString('username');

        const docRef2 = doc(db, 'serverUsers', interaction.guild.id, 'users', interaction.user.id);
        const docSnap = await getDoc(docRef2);
        if (docSnap.exists()) {
            const data = docSnap.data()
            var alreadyLinkedEmbed = new EmbedBuilder()
                .setTitle(`${lang[langOpt].link.line_1}`)
                .setDescription(
                    `${lang[langOpt].link.line_2}:` +
                    `\n**${data.username}** [${data.platform}]`)
                .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp()
                .setColor("Red");

            return interaction.editReply({ embeds: [alreadyLinkedEmbed], ephemeral: true });
        } else {

            var url = encodeURI(`https://api.mozambiquehe.re/bridge?version=5&platform=${platform}&player=${player}&auth=${auth}`);
            fetch(url)
                .then(res => {
                    if (res.status === 200) { return res.json() } else {
                        handleError(interaction, langOpt, res.status)
                        return Promise.reject('Error occurred');
                    }
                })
                .then(async data => {
                    if (!data || !data?.global || !data?.global?.name || data?.global?.name === '') return sentLookUpError(interaction, langOpt);

                    const citiesRef = collection(db, 'serverUsers', interaction.guild.id, 'users');
                    await setDoc(doc(citiesRef, interaction.user.id), {
                        platform: platform,
                        username: data.global.name
                    });
                    var linkedEmbed = new EmbedBuilder()
                        .setTitle(`${lang[langOpt].link.line_3}`)
                        .setDescription(`${lang[langOpt].link.line_4}:` +
                            `\n**${data.global.name}** [${platform}]`)
                        .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                        .setTimestamp()
                        .setColor(embedColor);

                    interaction.editReply({ embeds: [linkedEmbed], ephemeral: true });
                }).catch(error => { console.error('Fetch error:', error) })
        }
    }
}
