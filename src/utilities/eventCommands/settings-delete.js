const { EmbedBuilder } = require('discord.js');
const { deleteDoc, doc } = require('firebase/firestore');
const lang = require('../../data/lang/lang.json');
const { sendErrorEmbed } = require('../../utilities/functions/utilities');
const { getDb } = require('../../utilities/functions/firebase');
const logger = require('../../utilities/functions/logger').child({ module: 'settings-delete' });

function getTimerKey(interaction) {
    return interaction.message?.interactionMetadata?.id || interaction.message?.interaction?.id;
}

module.exports = {
    async execute(interaction, userData, timers) {
        await interaction.deferUpdate();
        const langOpt = userData.lang;
        const timerKey = getTimerKey(interaction);

        if (timerKey && timers[timerKey]) {
            clearTimeout(timers[timerKey]);
            delete timers[timerKey];
        }

        if (interaction.customId === 'settings-delete-confirm') {
            try {
                await deleteDoc(doc(getDb(), 'users', interaction.user.id));
                const successEmbed = new EmbedBuilder()
                    .setTitle(`${lang[langOpt].settings.line_7}`)
                    .setColor('Green');

                return interaction.editReply({
                    embeds: [successEmbed],
                    components: [],
                    ephemeral: userData.invisible,
                });
            } catch (error) {
                logger.error('Failed to delete user settings', {
                    error,
                    userId: interaction.user.id,
                });
                return sendErrorEmbed(interaction, userData);
            }
        }

        const cancelledEmbed = new EmbedBuilder()
            .setTitle(`${lang[langOpt].settings.line_8}`)
            .setColor('Red');

        return interaction.editReply({
            embeds: [cancelledEmbed],
            components: [],
            ephemeral: userData.invisible,
        });
    },
};
