const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const path = require('path');
require('dotenv').config();
const fs = require('fs');

const client = new Client({
    intents:
        [GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
        ],
    partials: [Partials.Channel]
});


client.slashCommands = new Collection();
client.contextCommands = new Collection();


const folders = fs.readdirSync(path.join(__dirname, 'commands/slashCommands'));
for (const folder of folders) {
    const files = fs.readdirSync(path.join(__dirname, `commands/slashCommands/${folder}`)).filter(file => file.endsWith('.js'));
    for (const file of files) {
        const commandSlash = require(`./commands/slashCommands/${folder}/${file}`);
        client.slashCommands.set(commandSlash.data.name, commandSlash);
        console.log(`File Loaded | ${file}`);
    }
}

// Load and register event handlers
const auth = process.env.APEX_AUTH;
const eventFolders = fs.readdirSync(path.join(__dirname, 'events'));
for (const folder of eventFolders) {
    const eventFiles = fs.readdirSync(path.join(__dirname, `events/${folder}`)).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`./events/${folder}/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, auth));
        } else {
            client.on(event.name, (...args) => event.execute(...args, auth));
        }
    }
}

client.login(process.env.TOKEN);