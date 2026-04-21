module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!interaction.isAutocomplete()) return;
        const command = interaction.client.slashCommands.get(interaction.commandName);
        if (!command || !command.autocomplete) return;
        try {
            await command.autocomplete(interaction);
        } catch (error) {
            const logger = require('../../utilities/functions/logger').child({
                module: 'autocomplete',
            });
            logger.warn('Autocomplete failed', {
                command: interaction.commandName,
                error,
                interactionId: interaction.id,
                userId: interaction.user.id,
            });
        }
    },
};
