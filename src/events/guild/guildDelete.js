const setGuildCount = require('../../utilities/functions/setGuildCount');
const logger = require('../../utilities/functions/logger').child({ module: 'guildDelete' });

module.exports = {
    name: 'guildDelete',
    once: false,
    async execute(guildDelete, auth) {
        logger.info('Bot removed from guild', {
            guildId: guildDelete.id,
            guildName: guildDelete.name,
        });
        setGuildCount.execute(guildDelete.client, auth);
    },
};
