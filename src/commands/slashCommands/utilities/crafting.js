const { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const fetch = require('node-fetch');
const Canvas = require('canvas');
const lang = require('../../../data/lang/lang.json');
const { embedColor } = require('../../../data/utilities/utilities.json')
const { handleError } = require('../../../utilities/functions/utilities')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crafting')
        .setDMPermission(true)
        .setDescription('Show current items that can be crafted at the replicator.')
        .setDescriptionLocalizations({
            nl: 'Toont de voorwerpen die je kan craften in de replicator.'
        }),

    async execute(interaction, auth, langOpt) {

        await interaction.deferReply({ ephemeral: true });

        const canvas = Canvas.createCanvas(400, 400);
        const ctx = canvas.getContext('2d');

        var url = encodeURI(`https://api.mozambiquehe.re/crafting?auth=${auth}`);
        fetch(url)
            .then(res => {
                if (res.status === 200) { return res.json() } else {
                    handleError(interaction, langOpt, res.status)
                    return Promise.reject('Error occurred');
                }
            })
            .then(async data => {
                //daily
                const daily1 = await Canvas.loadImage(data[0].bundleContent[0].itemType.asset);
                var daily_x_1 = 200;
                var daily_y_1 = 0;
                ctx.drawImage(daily1, daily_x_1, daily_y_1);

                const daily2 = await Canvas.loadImage(data[0].bundleContent[1].itemType.asset);
                var daily_x_2 = 0;
                var daily_y_2 = 0;
                ctx.drawImage(daily2, daily_x_2, daily_y_2);

                //weekly
                const weekly1 = await Canvas.loadImage(data[1].bundleContent[0].itemType.asset);
                w_x1 = 0;
                w_y1 = 200;
                ctx.drawImage(weekly1, w_x1, w_y1);

                const weekly2 = await Canvas.loadImage(data[2].bundleContent[0].itemType.asset);
                w_x2 = 200;
                w_y2 = 200;
                ctx.drawImage(weekly2, w_x2, w_y2);

                var attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'crafting.png' });

                var craftingEmbed = new EmbedBuilder()
                    .setTitle("Crafting Cycle")
                    .setDescription(`${lang[langOpt].crafting.line_2}: <t:${data[0].end}:R>`)
                    .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp()
                    .setColor(embedColor)
                    .setImage(`attachment://${attachment.name}`);


                return interaction.editReply({ embeds: [craftingEmbed], files: [attachment], ephemeral: true });
            }).catch(error => { console.error('Fetch error:', error) })
    }
}
