const fs = require('fs');
const path = require('path');

function getJavaScriptFiles(directory) {
    return fs
        .readdirSync(directory, { withFileTypes: true })
        .filter(entry => entry.isFile() && entry.name.endsWith('.js'))
        .map(entry => entry.name)
        .sort((a, b) => a.localeCompare(b));
}

function getDirectories(directory) {
    return fs
        .readdirSync(directory, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .sort((a, b) => a.localeCompare(b));
}

function loadSlashCommandModules() {
    const commandRoot = path.join(__dirname, '../../commands/slashCommands');
    const commands = [];

    for (const folder of getDirectories(commandRoot)) {
        const folderPath = path.join(commandRoot, folder);

        for (const file of getJavaScriptFiles(folderPath)) {
            const command = require(path.join(folderPath, file));
            if (!command?.data?.name || typeof command.execute !== 'function') {
                throw new Error(`Invalid slash command module: ${path.join(folder, file)}`);
            }

            commands.push({ command, file, folder });
        }
    }

    return commands;
}

function loadEventModules() {
    const eventRoot = path.join(__dirname, '../../events');
    const events = [];

    for (const folder of getDirectories(eventRoot)) {
        const folderPath = path.join(eventRoot, folder);

        for (const file of getJavaScriptFiles(folderPath)) {
            const event = require(path.join(folderPath, file));
            if (!event?.name || typeof event.execute !== 'function') {
                throw new Error(`Invalid event module: ${path.join(folder, file)}`);
            }

            events.push({ event, file, folder });
        }
    }

    return events;
}

module.exports = {
    loadEventModules,
    loadSlashCommandModules,
};
