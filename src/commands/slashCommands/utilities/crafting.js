const { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Canvas = require('canvas');
const { handleError } = require('../../../utilities/functions/utilities');
const { fetchJson } = require('../../../utilities/functions/http');
const path = require('path');

const bannerPath = path.join(__dirname, '../../../data/utilities/images/other/banner-back.png');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crafting')
        .setDescription('Show current items that can be crafted at the replicator.')
        .setDescriptionLocalizations({
            nl: 'Toont de voorwerpen die je kan craften in de replicator.',
        }),

    async execute(interaction, auth, userData) {
        await interaction.deferReply({ ephemeral: userData.invisible });

        const url = encodeURI(`https://api.mozambiquehe.re/crafting?auth=${auth}`);
        const data = await fetchJson(url, {
            cacheKey: 'apex:crafting',
            cacheTtlMs: 60 * 1000,
            label: 'Apex crafting rotation',
            timeoutMs: 10_000,
        }).catch(error => handleError(interaction, userData, error));

        const canvas = Canvas.createCanvas(400, 400);
        const ctx = canvas.getContext('2d');
        const [daily1, daily2, weekly1, weekly2] = await Promise.all([
            Canvas.loadImage(data[4].bundleContent[0].itemType.asset),
            Canvas.loadImage(data[3].bundleContent[0].itemType.asset),
            Canvas.loadImage(bannerPath),
            Canvas.loadImage(data[5].bundleContent[0].itemType.asset),
        ]);

        ctx.drawImage(daily1, 200, 0);
        ctx.drawImage(daily2, 0, 0);
        ctx.drawImage(weekly1, 0, 200);
        ctx.drawImage(weekly2, 200, 200);

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'crafting.png' });
        const craftingEmbed = new EmbedBuilder()
            .setTitle('Crafting Cycle')
            .setFooter({
                text: `${interaction.client.user.username} :heart:`,
                iconURL: interaction.client.user.displayAvatarURL(),
            })
            .setTimestamp()
            .setColor(userData.embedColor)
            .setImage(`attachment://${attachment.name}`);

        return interaction.editReply({
            embeds: [craftingEmbed],
            files: [attachment],
            ephemeral: userData.invisible,
        });
    },
};
