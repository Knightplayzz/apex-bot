const loadoutFile = require('../../utilities/eventCommands/loadout.js');
const logger = require('../../utilities/functions/logger').child({ module: 'selectMenu' });

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!interaction.isStringSelectMenu()) return;

        try {
            if (interaction.customId === 'loadout') await loadoutFile.execute(interaction);
        } catch (error) {
            logger.warn('Select menu handler failed', {
                customId: interaction.customId,
                error,
                interactionId: interaction.id,
                userId: interaction.user.id,
            });
        }
    },
};
