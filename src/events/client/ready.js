const cron = require('node-cron');
const timedInteraction1 = require('../../utilities/timedEvents/botStatus.js');
const setGuildCount = require('../../utilities/functions/setGuildCount.js');
const logger = require('../../utilities/functions/logger').child({ module: 'ready' });

module.exports = {
    name: 'ready',
    once: true,
    async execute(client, auth) {
        logger.info('Bot is online', {
            guilds: client.guilds.cache.size,
            tag: client.user.tag,
            userId: client.user.id,
        });
        cron.schedule('* * * * *', () => {
            timedInteraction1.execute(client, auth).catch(error => {
                logger.warn('Timed bot status update failed', { error });
            });
        });
        setGuildCount.execute(client, auth);
    },
};
