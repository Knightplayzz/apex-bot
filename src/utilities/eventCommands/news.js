const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fetch = require('node-fetch');
const { handleError } = require('../functions/utilities');

module.exports = {
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

                await interaction.deferUpdate();

                if (interaction.message.components[0].components[0].data.disabled === true) {

                    var embed1 = new EmbedBuilder()
                        .setTitle(data[1].title)
                        .setDescription(data[1].short_desc)
                        .setURL(data[1].link)
                        .setImage(data[1].img);

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel("<")
                                .setCustomId('1')
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setLabel(">")
                                .setCustomId('2')
                                .setStyle(ButtonStyle.Success)
                        );

                    return interaction.message.edit({ embeds: [embed1], components: [row] });
                }
                if (interaction.customId === '2') {
                    var embed1 = new EmbedBuilder()
                        .setTitle(data[2].title)
                        .setDescription(data[2].short_desc)
                        .setURL(data[2].link)
                        .setImage(data[2].img);

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel("<")
                                .setCustomId('1')
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setLabel(">")
                                .setCustomId('2')
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true)
                        );

                    return interaction.message.edit({ embeds: [embed1], components: [row] });
                }
                if (interaction.message.components[0].components[1].data.disabled === true) {
                    var embed1 = new EmbedBuilder()
                        .setTitle(data[1].title)
                        .setDescription(data[1].short_desc)
                        .setURL(data[1].link)
                        .setImage(data[1].img);

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel("<")
                                .setCustomId('1')
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setLabel(">")
                                .setCustomId('2')
                                .setStyle(ButtonStyle.Success)
                        );

                    return interaction.message.edit({ embeds: [embed1], components: [row] });
                } else {
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

                    return interaction.message.edit({ embeds: [embed1], components: [row] });
                }
            }).catch(error => { console.error('Fetch error:', error) });
    }
}