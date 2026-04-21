const logger = require('./logger').child({ module: 'interactions' });

function isAlreadyAcknowledged(error) {
    return error?.code === 40060 || error?.message?.includes('already been acknowledged');
}

function isUnknownInteraction(error) {
    return error?.code === 10062 || error?.message?.includes('Unknown interaction');
}

async function safeDefer(interaction, options = {}) {
    if (interaction.deferred || interaction.replied) return null;

    try {
        if (interaction.isButton?.() || interaction.isStringSelectMenu?.()) {
            return interaction.deferUpdate();
        }

        return interaction.deferReply(options);
    } catch (error) {
        if (!isAlreadyAcknowledged(error) && !isUnknownInteraction(error)) {
            logger.warn('Failed to defer interaction', { error, interactionId: interaction.id });
        }
        return null;
    }
}

async function safeRespond(interaction, options = {}) {
    try {
        if (interaction.deferred || interaction.replied) {
            return interaction.editReply(options);
        }

        return interaction.reply(options);
    } catch (error) {
        if (!isAlreadyAcknowledged(error) && !isUnknownInteraction(error)) {
            logger.warn('Failed to respond to interaction', {
                error,
                interactionId: interaction.id,
            });
        }
        return null;
    }
}

async function safeEdit(interaction, options = {}) {
    try {
        if (interaction.deferred || interaction.replied) {
            return interaction.editReply(options);
        }

        return interaction.reply(options);
    } catch (error) {
        if (!isAlreadyAcknowledged(error) && !isUnknownInteraction(error)) {
            logger.warn('Failed to edit interaction reply', {
                error,
                interactionId: interaction.id,
            });
        }
        return null;
    }
}

module.exports = {
    safeDefer,
    safeEdit,
    safeRespond,
};
