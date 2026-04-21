const {
    EmbedBuilder,
    SlashCommandBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require('discord.js');
const { handleError } = require('../../../utilities/functions/utilities');
const { fetchJson } = require('../../../utilities/functions/http');

function createNewsButtons(index, length) {
    const first = new ButtonBuilder()
        .setCustomId('pageFirst')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(index === 0)
        .setEmoji('\u23EA');

    const prev = new ButtonBuilder()
        .setCustomId('prev')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(index === 0)
        .setEmoji('\u2B05\uFE0F');

    const pageCount = new ButtonBuilder()
        .setCustomId('pageCount')
        .setLabel(`${index + 1}/${length}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true);

    const next = new ButtonBuilder()
        .setCustomId('next')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(index === length - 1)
        .setEmoji('\u27A1\uFE0F');

    const last = new ButtonBuilder()
        .setCustomId('pageLast')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(index === length - 1)
        .setEmoji('\u23E9');

    return new ActionRowBuilder().addComponents([first, prev, pageCount, next, last]);
}

function createNewsEmbed(article, userData) {
    return new EmbedBuilder()
        .setTitle(article.title)
        .setDescription(article.short_desc)
        .setColor(userData.embedColor)
        .setURL(article.link)
        .setImage(article.img);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('news')
        .setDescription('Shows the latest news form EA news feed about Apex Legends.')
        .setDescriptionLocalizations({ nl: 'Toont het laatste nieuws van EA over Apex Legends.' }),

    async execute(interaction, auth, userData) {
        await interaction.deferReply({ ephemeral: userData.invisible });

        const url = `https://api.mozambiquehe.re/news?auth=${auth}`;
        const data = await fetchJson(url, {
            cacheKey: 'apex:news',
            cacheTtlMs: 60 * 1000,
            label: 'Apex news',
            timeoutMs: 10_000,
        }).catch(error => handleError(interaction, userData, error));

        const pagesEmbed = createNewsEmbed(data[0], userData);
        const buttons = createNewsButtons(0, data.length);

        return interaction.editReply({
            embeds: [pagesEmbed],
            components: [buttons],
            ephemeral: userData.invisible,
        });
    },
    createNewsButtons,
    createNewsEmbed,
};
