const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require('node-fetch');
const lang = require('../../../data/lang/lang.json');
const { getMapDescription, sentErrorEmbed } = require('../../../utilities/functions/utilities')
const { embedColor } = require('../../../data/utilities/utilities.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('map')
        .setDMPermission(true)
        .setDescription('Shows the current in-game map.')
        .addStringOption(option =>
            option.setName('gamemode')
                .setDescription('Select Gamemode.')
                .setRequired(false)
                .addChoices(
                    { name: 'Battle Royale', value: 'br' },
                    { name: 'Ranked', value: 'ranked' },
                    { name: 'LTM', value: 'ltm' },
                )),

    async execute(interaction, auth, langOpt) {

        await interaction.deferReply({ ephemeral: true });

        var type = interaction.options.get('gamemode')?.value ?? "br";
        var url = encodeURI(`https://api.mozambiquehe.re/maprotation?version=2&auth=${auth}`);
        fetch(url)
            .then(res => { if (res.status === 200) { return res.json() } else return sentErrorEmbed(interaction, langOpt, `map.js l.27`) })
            .then(data => {
                var mapDescr = getMapDescription(type, data, langOpt);

                const mapEmbed = new EmbedBuilder()
                    .setTitle(mapDescr.title)
                    .setDescription(mapDescr.description)
                    .setImage(mapDescr.image)
                    .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp()
                    .setColor(embedColor);

                return interaction.editReply({ embeds: [mapEmbed], ephemeral: true });
            }).catch(error => { return sentErrorEmbed(interaction, langOpt, error) })
    }
}

