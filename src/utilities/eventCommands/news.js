const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fetch = require('node-fetch');
const { handleError } = require('../functions/utilities');

module.exports = {
    async execute(interaction, auth, userData) {

        await interaction.deferUpdate();

        var url = `https://api.mozambiquehe.re/news?auth=${auth}`;
        fetch(url)
            .then(res => {
                if (res.status === 200) { return res.json() } else {
                    handleError(interaction, langOpt, res.status);
                    return Promise.reject('Error occurred');
                }
            })
            .then(async data => {

                var str = interaction.message.components[0].components[2].label;
                var parts = str.split("/");
                var index = parseInt(parts[0]) - 1;

                const frist = new ButtonBuilder()
                    .setCustomId(`pageFirst`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(`⏪`);

                const prev = new ButtonBuilder()
                    .setCustomId(`prev`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(`⬅`);

                const pageCount = new ButtonBuilder()
                    .setCustomId(`pageCount`)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)

                const next = new ButtonBuilder()
                    .setCustomId(`next`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(`➡`);

                const last = new ButtonBuilder()
                    .setCustomId(`pageLast`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(`⏩`);


                if (interaction.customId === 'pageFirst') {
                    index = 0;
                    pageCount.setLabel(`${index + 1}/${data.length}`);

                } else if (interaction.customId === 'prev') {
                    if (index > 0) index--;
                    pageCount.setLabel(`${index + 1}/${data.length}`);

                } else if (interaction.customId === 'next') {
                    if (index < data.length - 1) index++;
                    pageCount.setLabel(`${index + 1}/${data.length}`);

                } else if (interaction.customId === 'pageLast') {
                    index = data.length - 1;
                    pageCount.setLabel(`${index + 1}/${data.length}`);
                }

                if (index === 0) {
                    frist.setDisabled(true);
                    prev.setDisabled(true);
                } else {
                    frist.setDisabled(false);
                    prev.setDisabled(false);
                }
                if (index === data.length - 1) {
                    last.setDisabled(true);
                    next.setDisabled(true);
                } else {
                    last.setDisabled(false);
                    next.setDisabled(false);
                }

                const buttons = new ActionRowBuilder().addComponents([frist, prev, pageCount, next, last]);

                var pagesEmbed = new EmbedBuilder()
                    .setTitle(data[index].title)
                    .setDescription(data[index].short_desc)
                    .setColor(userData.embedColor)
                    .setURL(data[index].link)
                    .setImage(data[index].img);


                return interaction.editReply({ embeds: [pagesEmbed], components: [buttons], empheral: userData.invisible });

            }).catch(error => { console.error('Fetch error:', error) });
    }
}