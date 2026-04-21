const {
    DEFAULT_USER_DATA,
    getUserData,
    normalizeUserData,
} = require('../../utilities/functions/firebase');
const { handleCommandError, sendVoteEmbed } = require('../../utilities/functions/utilities');
const { hasUserPremium } = require('../../utilities/functions/hasUserPremium');
const logger = require('../../utilities/functions/logger').child({ module: 'slashCommands' });

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction, auth) {
        if (!interaction.isChatInputCommand()) return;

        const slashCommand = interaction.client.slashCommands.get(interaction.commandName);
        if (!slashCommand) {
            logger.warn('Received unknown slash command', {
                command: interaction.commandName,
                guildId: interaction.guild?.id,
                userId: interaction.user.id,
            });
            return;
        }

        const startedAt = Date.now();
        let userData = normalizeUserData(DEFAULT_USER_DATA);

        try {
            const hasPremiumAccess = await hasUserPremium(interaction);

            if (slashCommand.premium === true && !hasPremiumAccess) {
                return sendVoteEmbed(interaction, userData);
            }

            if (hasPremiumAccess) {
                userData = await getUserData(interaction.user.id);
            }

            await slashCommand.execute(interaction, auth, userData);
            logger.info('Slash command completed', {
                command: interaction.commandName,
                guildId: interaction.guild?.id,
                ms: Date.now() - startedAt,
                userId: interaction.user.id,
            });
        } catch (error) {
            await handleCommandError(interaction, userData, error);
        }
    },
};
