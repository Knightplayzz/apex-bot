const { Client, GatewayIntentBits, Partials, Collection, Routes, REST } = require('discord.js');
const fs = require("fs");
require('dotenv').config()

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
const slashCommands = [];


//slash commands
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const folders = fs.readdirSync(`${__dirname}/commands/slashCommands`);
for (const folder of folders) {
    const files = fs.readdirSync(`${__dirname}/commands/slashCommands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of files) {
        const commandSlash = require(`./commands/slashCommands/${folder}/${file}`);
        client.slashCommands.set(commandSlash.data.name, commandSlash);
        slashCommands.push(commandSlash.data.toJSON());
        console.log(`File Loaded | ${file}`);
    };
}

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENTID),
            { body: slashCommands }
        )
        console.log('succesfully reloaded application (/) commands.');
    } catch (error) {
        console.log(error)
    }
})()

const auth = process.env.APEX_AUTH
const eventFolders = fs.readdirSync(`${__dirname}/events`);
for (const folder of eventFolders) {
    const eventFiles = fs.readdirSync(`${__dirname}/events/${folder}`).filter(file => file.endsWith('.js'));
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