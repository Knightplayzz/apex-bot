const { SlashCommandBuilder, InteractionContextType } = require("discord.js");
const fetch = require('node-fetch');
const lang = require('../../../data/lang/lang.json');
const { handleError } = require('../../../utilities/functions/utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('drop')
        .setContexts(InteractionContextType.BotDM)
        .setDescription('Select a random drop location from the current map, or select a specific map to choose from.')
        .setDescriptionLocalizations({ nl: 'Kies een willekeurige plek om te droppen in de huidige map, of selecteer een specifieke map.' })
        .addStringOption(option =>
            option.setName('map')
                .setDescription('Manually pick a map.')
                .setDescriptionLocalizations({ nl: 'Kies handmatig  een map.' })
                .setRequired(false)
                .addChoices(
                    { name: 'Kings Canyon', value: 'Kings Canyon' },
                    { name: "World's Edge", value: "World's Edge" },
                    { name: 'Olympus', value: 'Olympus' },
                    { name: 'Storm Point', value: 'Storm Point' },
                    { name: 'Broken Moon', value: 'Broken Moon' },
                    { name: 'E-District', value: 'E-District' },
                )
        ),
    async execute(interaction, auth, userData) {

        const langOpt = userData.lang;
        await interaction.deferReply({ ephemeral: userData.invisible });

        const mapOption = interaction.options.get('map');

        if (mapOption != null) {
            const mapFile = require(`../../../data/maps/${mapOption.value}.json`);
            const map = Math.floor(Math.random() * mapFile.length);
            interaction.editReply({ content: `${lang[langOpt].drop.line_1} **${mapFile[map]}** ${lang[langOpt].drop.line_2} ${mapOption.value}!`, ephemeral: userData.invisible });
        } else {
            const url = `https://api.mozambiquehe.re/maprotation?auth=${auth}`;
            fetch(url)
                .then(res => res.status === 200 ? res.json() : handleError(interaction, userData, res.status))
                .then(async data => {
                    const mapFile = require(`../../../data/maps/${data.current.map}.json`);
                    const map = Math.floor(Math.random() * mapFile.length);
                    interaction.editReply({ content: `${lang[langOpt].drop.line_1} **${mapFile[map]}** ${lang[langOpt].drop.line_2} ${data.current.map}!`, ephemeral: userData.invisible });
                }).catch(error => { console.error('Fetch error:', error) });
        }
    }
}