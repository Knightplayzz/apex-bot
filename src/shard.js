const { ShardingManager } = require('discord.js');
require('dotenv').config();
const path = require('path');

const manager = new ShardingManager(path.join(__dirname, 'bot.js'), { token: process.env.TOKEN });
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();