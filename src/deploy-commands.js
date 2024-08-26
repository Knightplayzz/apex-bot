const { Routes, REST } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Initialize the REST client
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Array to hold the slash commands
const slashCommands = [];

// Load and register commands
const commandFolders = fs.readdirSync(path.join(__dirname, 'commands/slashCommands'));
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(path.join(__dirname, `commands/slashCommands/${folder}`)).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/slashCommands/${folder}/${file}`);
        slashCommands.push(command.data.toJSON());
        console.log(`Loaded command: ${file}`);
    }
}

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENTID),
            { body: slashCommands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Error while refreshing commands:', error);
    }
})();