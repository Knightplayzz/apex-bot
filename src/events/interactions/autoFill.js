module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, auth) {
        if (!interaction.isAutocomplete()) return;
        const command = interaction.client.slashCommands.get(interaction.commandName);
        if (!command || !command.autocomplete) return;
        try {
            await command.autocomplete(interaction);
        } catch (error) {
            console.error(error);
        }
    }
};