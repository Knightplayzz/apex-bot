const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
require('dotenv').config();
const { loadEventModules, loadSlashCommandModules } = require('./utilities/functions/loaders');
const logger = require('./utilities/functions/logger').child({ module: 'bot' });

for (const eventName of ['unhandledRejection', 'uncaughtException']) {
    process.on(eventName, error => {
        logger.error(`Process ${eventName}`, { error });
    });
}

if (!process.env.TOKEN) {
    logger.error('Missing required TOKEN environment variable');
    process.exit(1);
}

if (!process.env.APEX_AUTH) {
    logger.warn('APEX_AUTH is missing; Apex API commands will fail until it is configured');
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
    partials: [Partials.Channel],
});

client.slashCommands = new Collection();

for (const { command, file, folder } of loadSlashCommandModules()) {
    client.slashCommands.set(command.data.name, command);
    logger.info('Slash command loaded', { command: command.data.name, file, folder });
}

const auth = process.env.APEX_AUTH;
for (const { event, file, folder } of loadEventModules()) {
    const listener = async (...args) => {
        try {
            await event.execute(...args, auth);
        } catch (error) {
            logger.error('Event handler failed', {
                error,
                event: event.name,
                file,
                folder,
            });
        }
    };

    if (event.once) {
        client.once(event.name, listener);
    } else {
        client.on(event.name, listener);
    }

    logger.info('Event loaded', { event: event.name, file, folder, once: event.once });
}

client.on('error', error => logger.error('Discord client error', { error }));
client.on('warn', message => logger.warn('Discord client warning', { message }));

client.login(process.env.TOKEN).catch(error => {
    logger.error('Discord login failed', { error });
    process.exit(1);
});
