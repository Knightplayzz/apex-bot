const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { handleError } = require('../../../utilities/functions/utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('news')
        .setDescription('Shows the latest news form EA news feed about Apex Legends.')
        .setDescriptionLocalizations({ nl: 'Toont het laatste nieuws van EA over Apex Legends.' }),

    async execute(interaction, auth, userData) {

        await interaction.deferReply({ ephemeral: userData.invisible });

        var url = `https://api.mozambiquehe.re/news?auth=${auth}`;
        fetch(url)
            .then(res => res.status === 200 ? res.json() : handleError(interaction, userData, res.status))
            .then(async data => {

                const frist = new ButtonBuilder()
                    .setCustomId(`pageFirst`)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true)
                    .setEmoji(`⏪`);

                const prev = new ButtonBuilder()
                    .setCustomId(`prev`)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true)
                    .setEmoji(`⬅`);

                const pageCount = new ButtonBuilder()
                    .setCustomId(`pageCount`)
                    .setLabel(`1/${data.length}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true);

                const next = new ButtonBuilder()
                    .setCustomId(`next`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(`➡`);

                const last = new ButtonBuilder()
                    .setCustomId(`pageLast`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(`⏩`);

                const buttons = new ActionRowBuilder().addComponents([frist, prev, pageCount, next, last]);

                var pagesEmbed = new EmbedBuilder()
                    .setTitle(data[0].title)
                    .setDescription(data[0].short_desc)
                    .setColor(userData.embedColor)
                    .setURL(data[0].link)
                    .setImage(data[0].img);

                interaction.editReply({ embeds: [pagesEmbed], components: [buttons], ephemeral: userData.invisible });

            }).catch(error => { console.error('Fetch error:', error) });
    }
}