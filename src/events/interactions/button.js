const { EmbedBuilder } = require('discord.js');
const {
    DEFAULT_USER_DATA,
    getUserData,
    normalizeUserData,
} = require('../../utilities/functions/firebase');
const { safeEdit, safeRespond } = require('../../utilities/functions/interactions');
const { handleCommandError } = require('../../utilities/functions/utilities');
const { embedColor } = require('../../data/utilities/utilities.json');
const { hasUserPremium } = require('../../utilities/functions/hasUserPremium.js');
const lang = require('../../data/lang/lang.json');
const newsFile = require('../../utilities/eventCommands/news.js');
const settingsDelete = require('../../utilities/eventCommands/settings-delete.js');
const logger = require('../../utilities/functions/logger').child({ module: 'buttons' });

const timers = {};
const NEWS_BUTTONS = new Set(['pageFirst', 'prev', 'next', 'pageLast']);
const SETTINGS_DELETE_BUTTONS = new Set(['settings-delete-confirm', 'settings-delete-cancel']);

function getSourceInteraction(interaction) {
    return interaction.message?.interactionMetadata || interaction.message?.interaction;
}

async function getInteractionUserContext(interaction) {
    const hasPremiumAccess = await hasUserPremium(interaction);
    return {
        hasPremiumAccess,
        userData: hasPremiumAccess
            ? await getUserData(interaction.user.id)
            : normalizeUserData({ embedColor }),
    };
}

function setInteractionTimer(key, callback) {
    if (!key) return;
    if (timers[key]) clearTimeout(timers[key]);
    timers[key] = setTimeout(() => {
        delete timers[key];
        callback();
    }, 15 * 1000);
}

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction, auth) {
        if (interaction.isChatInputCommand()) {
            const isNewsCommand = interaction.commandName === 'news';
            const isSettingsDelete =
                interaction.commandName === 'settings' &&
                interaction.options.getSubcommand(false) === 'delete';
            if (!isNewsCommand && !isSettingsDelete) return;

            try {
                const { hasPremiumAccess, userData } = await getInteractionUserContext(interaction);

                if (isSettingsDelete && !hasPremiumAccess) return;

                if (isNewsCommand) {
                    return setInteractionTimer(interaction.id, () => {
                        safeEdit(interaction, { components: [], ephemeral: userData.invisible });
                    });
                }

                const langOpt = userData.lang;
                const cancelledEmbed = new EmbedBuilder()
                    .setTitle(`${lang[langOpt].settings.line_8}`)
                    .setDescription(`${lang[langOpt].settings.line_9}`)
                    .setColor('Red');

                return setInteractionTimer(interaction.id, () => {
                    safeEdit(interaction, {
                        embeds: [cancelledEmbed],
                        components: [],
                        ephemeral: userData.invisible,
                    });
                });
            } catch (error) {
                logger.warn('Failed to create interaction timer', {
                    command: interaction.commandName,
                    error,
                    interactionId: interaction.id,
                });
            }
        }

        if (!interaction.isButton()) return;

        const sourceInteraction = getSourceInteraction(interaction);
        const sourceUserId = sourceInteraction?.user?.id;

        if (sourceUserId && interaction.user.id !== sourceUserId) {
            return safeRespond(interaction, { content: 'Not your button!', ephemeral: true });
        }

        if (
            !NEWS_BUTTONS.has(interaction.customId) &&
            !SETTINGS_DELETE_BUTTONS.has(interaction.customId)
        )
            return;

        let userData = normalizeUserData(DEFAULT_USER_DATA);
        try {
            userData = (await getInteractionUserContext(interaction)).userData;

            if (NEWS_BUTTONS.has(interaction.customId)) {
                setInteractionTimer(sourceInteraction?.id, () => {
                    safeEdit(interaction, { components: [], ephemeral: userData.invisible });
                });
                return newsFile.execute(interaction, auth, userData);
            }

            if (SETTINGS_DELETE_BUTTONS.has(interaction.customId)) {
                return settingsDelete.execute(interaction, userData, timers);
            }
        } catch (error) {
            await handleCommandError(interaction, userData, error);
        }
    },
};
