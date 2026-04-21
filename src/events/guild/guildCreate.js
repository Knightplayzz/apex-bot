const setGuildCount = require('../../utilities/functions/setGuildCount');
const logger = require('../../utilities/functions/logger').child({ module: 'guildCreate' });

module.exports = {
    name: 'guildCreate',
    once: false,
    async execute(guild, auth) {
        logger.info('Bot added to guild', {
            guildId: guild.id,
            guildName: guild.name,
        });
        setGuildCount.execute(guild.client, auth);
    },
};
