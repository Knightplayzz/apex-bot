const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { handleError } = require('../../../utilities/functions/utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('news')
        .setDescription('Shows the latest news form EA news feed about Apex Legends.')
        .setDescriptionLocalizations({
            nl: 'Toont het laatste nieuws van EA over Apex Legends.'
        }),

    async execute(interaction, auth) {

        var url = `https://api.mozambiquehe.re/news?auth=${auth}`;
        fetch(url)
            .then(res => {
                if (res.status === 200) { return res.json() } else {
                    handleError(interaction, langOpt, res.status);
                    return Promise.reject('Error occurred');
                }
            })
            .then(async data => {

                var embed1 = new EmbedBuilder()
                    .setTitle(data[0].title)
                    .setDescription(data[0].short_desc)
                    .setURL(data[0].link)
                    .setImage(data[0].img);

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("<")
                            .setCustomId('1')
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setLabel(">")
                            .setCustomId('2')
                            .setStyle(ButtonStyle.Success)
                    );

                interaction.reply({ embeds: [embed1], components: [row] });
            }).catch(error => { console.error('Fetch error:', error) });
    }
}