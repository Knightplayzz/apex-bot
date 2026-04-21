const { handleError } = require('../functions/utilities');
const { fetchJson } = require('../functions/http');
const {
    createNewsButtons,
    createNewsEmbed,
} = require('../../commands/slashCommands/utilities/news');

module.exports = {
    async execute(interaction, auth, userData) {
        await interaction.deferUpdate();

        const url = `https://api.mozambiquehe.re/news?auth=${auth}`;
        const data = await fetchJson(url, {
            cacheKey: 'apex:news',
            cacheTtlMs: 60 * 1000,
            label: 'Apex news pagination',
            timeoutMs: 10_000,
        }).catch(error => handleError(interaction, userData, error));

        const str = interaction.message.components[0].components[2].label;
        const parts = str.split('/');
        let index = parseInt(parts[0], 10) - 1;

        if (interaction.customId === 'pageFirst') {
            index = 0;
        } else if (interaction.customId === 'prev') {
            if (index > 0) index--;
        } else if (interaction.customId === 'next') {
            if (index < data.length - 1) index++;
        } else if (interaction.customId === 'pageLast') {
            index = data.length - 1;
        }

        const buttons = createNewsButtons(index, data.length);
        const pagesEmbed = createNewsEmbed(data[index], userData);

        return interaction.editReply({
            embeds: [pagesEmbed],
            components: [buttons],
            ephemeral: userData.invisible,
        });
    },
};
