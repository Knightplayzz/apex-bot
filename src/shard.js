const { ShardingManager } = require('discord.js');
require('dotenv').config();
const path = require('path');
const logger = require('./utilities/functions/logger').child({ module: 'shard' });

if (!process.env.TOKEN) {
    logger.error('Missing required TOKEN environment variable');
    process.exit(1);
}

const manager = new ShardingManager(path.join(__dirname, 'bot.js'), { token: process.env.TOKEN });

manager.on('shardCreate', shard => {
    logger.info('Shard launched', { shardId: shard.id });

    shard.on('death', process => {
        logger.error('Shard process died', {
            code: process.exitCode,
            shardId: shard.id,
            signal: process.signalCode,
        });
    });
    shard.on('disconnect', () => logger.warn('Shard disconnected', { shardId: shard.id }));
    shard.on('error', error => logger.error('Shard error', { error, shardId: shard.id }));
    shard.on('ready', () => logger.info('Shard ready', { shardId: shard.id }));
    shard.on('reconnecting', () => logger.warn('Shard reconnecting', { shardId: shard.id }));
});

manager.spawn().catch(error => {
    logger.error('Failed to spawn shards', { error });
    process.exit(1);
});
