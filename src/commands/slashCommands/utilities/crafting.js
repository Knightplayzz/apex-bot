const { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const fetch = require('node-fetch');
const Canvas = require('canvas');
const { handleError } = require('../../../utilities/functions/utilities');
const path = require('path');
const bannerPath = path.join(__dirname, '../../../data/utilities/images/other/banner-back.png');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crafting')
        .setDescription('Show current items that can be crafted at the replicator.')
        .setDescriptionLocalizations({ nl: 'Toont de voorwerpen die je kan craften in de replicator.' }),

    async execute(interaction, auth, userData) {

        await interaction.deferReply({ ephemeral: userData.invisible });

        const canvas = Canvas.createCanvas(400, 400);
        const ctx = canvas.getContext('2d');

        const url = encodeURI(`https://api.mozambiquehe.re/crafting?auth=${auth}`);
        fetch(url)
            .then(res => res.status === 200 ? res.json() : handleError(interaction, userData, res.status))
            .then(async data => {

                //top right
                const daily1 = await Canvas.loadImage(data[4].bundleContent[0].itemType.asset);
                ctx.drawImage(daily1, 200, 0);

                //top left
                const daily2 = await Canvas.loadImage(data[3].bundleContent[0].itemType.asset);
                ctx.drawImage(daily2, 0, 0);

                //bottom left
                const weekly1 = await Canvas.loadImage(bannerPath);
                ctx.drawImage(weekly1, 0, 200);

                //bottom right
                const weekly2 = await Canvas.loadImage(data[5].bundleContent[0].itemType.asset);
                ctx.drawImage(weekly2, 200, 200);

                const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'crafting.png' });

                const craftingEmbed = new EmbedBuilder()
                    .setTitle("Crafting Cycle")
                    .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp()
                    .setColor(userData.embedColor)
                    .setImage(`attachment://${attachment.name}`);

                return interaction.editReply({ embeds: [craftingEmbed], files: [attachment], ephemeral: userData.invisible });
            }).catch(error => { console.error('Fetch error:', error) });
    }
}