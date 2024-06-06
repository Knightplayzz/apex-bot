const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require('node-fetch');
const { getMapDescription, handleError } = require('../../../utilities/functions/utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('map')
        .setDMPermission(true)
        .setDescription('Shows the current in-game map.')
        .setDescriptionLocalizations({
            nl: 'Zie de huidige in-game map.'
        })
        .addStringOption(option =>
            option.setName('gamemode')
                .setDescription('Select Gamemode.')
                .setNameLocalizations({
                    nl: 'gamemode'
                })
                .setDescriptionLocalizations({
                    nl: 'Kies een Gamemode.'
                })
                .setRequired(false)
                .addChoices(
                    { name: 'Battle Royale', value: 'br' },
                    { name: 'Ranked', value: 'ranked' },
                    { name: 'LTM', value: 'ltm' },
                )),

    async execute(interaction, auth, userData) {

        var langOpt = userData.lang

        await interaction.deferReply({ ephemeral: userData.invisible });

        var type = interaction.options.get('gamemode')?.value ?? "br";
        var url = encodeURI(`https://api.mozambiquehe.re/maprotation?version=2&auth=${auth}`);
        fetch(url)
            .then(res => {
                if (res.status === 200) { return res.json() } else {
                    handleError(interaction, userData, res.status);
                    return Promise.reject('Error occurred');
                }
            })
            .then(data => {
                var mapDescr = getMapDescription(type, data, langOpt);

                const mapEmbed = new EmbedBuilder()
                    .setTitle(mapDescr.title)
                    .setDescription(mapDescr.description)
                    .setImage(mapDescr.image)
                    .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp()
                    .setColor(userData.embedColor);

                return interaction.editReply({ embeds: [mapEmbed], ephemeral: userData.invisible });
            }).catch(error => { console.error('Fetch error:', error) })
    }
}

