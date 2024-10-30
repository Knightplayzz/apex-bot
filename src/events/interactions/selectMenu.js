const loadoutFile = require('../../utilities/eventCommands/loadout.js');

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction) {
        if (!interaction.isStringSelectMenu()) return;

        if (interaction.customId === 'loadout') loadoutFile.execute(interaction);
    }
}