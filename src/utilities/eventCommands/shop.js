const { EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Canvas = require('canvas');
const fetch = require('node-fetch');
const { sentErrorEmbed } = require('../functions/utilities');

module.exports = {
    async execute(interaction, auth, langOpt) {

        await interaction.deferReply({ ephemeral: true });

        const canvas = Canvas.createCanvas(2000, 1500)
        const ctx = canvas.getContext('2d')

        var url = encodeURI(`https://api.mozambiquehe.re/store?auth=${auth}`);


        fetch(url)
            .then(res => { if (res.status === 200) { return res.json() } else return sentErrorEmbed(interaction, langOpt, 'shop.js l.18') })
            .then(async data => {
                var z = -400
                var p = 0

                var botEmbed = new EmbedBuilder()
                    .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp()

                const message = interaction.message

                if (interaction.customId === "1") {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].shopType === 'specials') {
                            z = z + 400
                            if (z > 1600) {
                                z = 0
                                p = +800
                            }
                            const daily1 = await Canvas.loadImage(data[i].asset)
                            var daily_x_1 = z
                            var daily_y_1 = p
                            ctx.drawImage(daily1, daily_x_1, daily_y_1)
                        }
                    }
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel("SPECIAL")
                                .setCustomId('1')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setLabel("SHOP")
                                .setCustomId('2')
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setLabel("MONTHLY")
                                .setCustomId('3')
                                .setStyle(ButtonStyle.Secondary)
                        )
                    var attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'hello.png' })
                    botEmbed.setImage(`attachment://${attachment.name}`)
                        .setTitle("SPECIALS")
                    await interaction.editReply({ content: "Reloaded" })
                    message.edit({ embeds: [botEmbed], files: [attachment], components: [row] })
                }
                if (interaction.customId === "2") {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].shopType === 'shop') {
                            z = z + 400
                            if (z > 1600) {
                                z = 0
                                p = +800
                            }
                            const daily1 = await Canvas.loadImage(data[i].asset)
                            var daily_x_1 = z
                            var daily_y_1 = p
                            ctx.drawImage(daily1, daily_x_1, daily_y_1)
                        }
                    }
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel("SPECIAL")
                                .setCustomId('1')
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setLabel("SHOP")
                                .setCustomId('2')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setLabel("MONTHLY")
                                .setCustomId('3')
                                .setStyle(ButtonStyle.Secondary)
                        )
                    var attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'hello.png' })
                    botEmbed.setImage(`attachment://${attachment.name}`)
                        .setTitle("SHOP")
                    await interaction.editReply({ content: "Reloaded" })
                    message.edit({ embeds: [botEmbed], files: [attachment], components: [row] })
                }
                if (interaction.customId === "3") {
                    // for (var i = 0; i < data.length; i++) {
                    //     if (data[i].shopType === 'shop') {
                    //         z = z + 400
                    //         if (z > 1600) {
                    //             z = 0
                    //             p = +800
                    //         }
                    //         const daily1 = await Canvas.loadImage(data[i].asset)
                    //         var daily_x_1 = z
                    //         var daily_y_1 = p
                    //         ctx.drawImage(daily1, daily_x_1, daily_y_1)
                    //     }
                    // }
                    // var attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'hello.png' })
                    //botEmbed.setImage(`attachment://${attachment.name}`)
                    botEmbed.setTitle("COMMING SOON ...")
                    //message.edit({ embeds: [botEmbed], content: "2", files: [attachment] })
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel("SPECIAL")
                                .setCustomId('1')
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setLabel("SHOP")
                                .setCustomId('2')
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setLabel("MONTHLY")
                                .setCustomId('3')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        )

                    await interaction.editReply({ content: "Reloaded" });
                    message.edit({ embeds: [botEmbed], files: [], components: [row] });
                }
            }).catch(error => { sentErrorEmbed(interaction, langOpt, error) })
    }
}