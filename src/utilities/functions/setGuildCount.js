const { postJson } = require('./http');
const logger = require('./logger').child({ module: 'guildCount' });

module.exports = {
    async execute(client) {
        try {
            const results = await client.shard.fetchClientValues('guilds.cache.size');
            const guildCount = results.reduce((acc, count) => acc + count, 0);

            try {
                const guildApexServ = client.guilds.cache.get('1018244995792257114');
                const guildCountChannel = guildApexServ?.channels.cache.get('1024393334007009391');
                await guildCountChannel?.setName(`Servers Active: ${guildCount}`);
            } catch (error) {
                logger.warn('Failed to update guild count channel', { error, guildCount });
            }

            if (!process.env.topgg_AUTH) {
                logger.warn('Skipping top.gg guild count update because topgg_AUTH is missing');
                return;
            }

            await postJson(
                'https://top.gg/api/bots/1014207340188270673/stats',
                {
                    server_count: guildCount,
                    shard_count: client.shard.count,
                },
                {
                    headers: { Authorization: process.env.topgg_AUTH },
                    label: 'top.gg guild count update',
                    timeoutMs: 7000,
                }
            );

            logger.info('Guild count updated', { guildCount, shardCount: client.shard.count });
        } catch (error) {
            logger.error('Failed to update guild count', { error });
        }
    },
};
