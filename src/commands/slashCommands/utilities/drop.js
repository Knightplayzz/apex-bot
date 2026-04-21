const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const lang = require('../../../data/lang/lang.json');
const { handleError } = require('../../../utilities/functions/utilities');
const { fetchJson } = require('../../../utilities/functions/http');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('drop')
        .setContexts(InteractionContextType.BotDM)
        .setDescription(
            'Select a random drop location from the current map, or select a specific map to choose from.'
        )
        .setDescriptionLocalizations({
            nl: 'Kies een willekeurige plek om te droppen in de huidige map, of selecteer een specifieke map.',
        })
        .addStringOption(option =>
            option
                .setName('map')
                .setDescription('Manually pick a map.')
                .setDescriptionLocalizations({ nl: 'Kies handmatig  een map.' })
                .setRequired(false)
                .addChoices(
                    { name: 'Kings Canyon', value: 'Kings Canyon' },
                    { name: 'World\u0027s Edge', value: 'World\u0027s Edge' },
                    { name: 'Olympus', value: 'Olympus' },
                    { name: 'Storm Point', value: 'Storm Point' },
                    { name: 'Broken Moon', value: 'Broken Moon' },
                    { name: 'E-District', value: 'E-District' }
                )
        ),

    async execute(interaction, auth, userData) {
        const langOpt = userData.lang;
        await interaction.deferReply({ ephemeral: userData.invisible });

        const mapOption = interaction.options.get('map');
        const mapName = mapOption?.value ?? (await getCurrentMap(auth, interaction, userData));
        const mapFile = require(`../../../data/maps/${mapName}.json`);
        const map = Math.floor(Math.random() * mapFile.length);

        return interaction.editReply({
            content: `${lang[langOpt].drop.line_1} **${mapFile[map]}** ${lang[langOpt].drop.line_2} ${mapName}!`,
            ephemeral: userData.invisible,
        });
    },
};

async function getCurrentMap(auth, interaction, userData) {
    const url = `https://api.mozambiquehe.re/maprotation?auth=${auth}`;
    const data = await fetchJson(url, {
        cacheKey: 'apex:maprotation:current',
        cacheTtlMs: 30 * 1000,
        label: 'Apex current map',
        timeoutMs: 10_000,
    }).catch(error => handleError(interaction, userData, error));

    return data.current.map;
}
