const { Routes, REST } = require('discord.js');
require('dotenv').config();
const { loadSlashCommandModules } = require('./utilities/functions/loaders');
const logger = require('./utilities/functions/logger').child({ module: 'deployCommands' });

if (!process.env.TOKEN || !process.env.CLIENTID) {
    logger.error('Missing required TOKEN and/or CLIENTID environment variables');
    process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const slashCommands = loadSlashCommandModules().map(({ command, file, folder }) => {
    logger.info('Slash command prepared for deploy', { command: command.data.name, file, folder });
    return command.data.toJSON();
});

(async () => {
    try {
        logger.info('Refreshing application slash commands', { count: slashCommands.length });

        await rest.put(Routes.applicationCommands(process.env.CLIENTID), { body: slashCommands });

        logger.info('Application slash commands refreshed', { count: slashCommands.length });
    } catch (error) {
        logger.error('Error while refreshing commands', { error });
        process.exitCode = 1;
    }
})();
