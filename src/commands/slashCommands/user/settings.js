const { SlashCommandBuilder } = require('discord.js');
const { linkSubCommand, linkSubFunction } = require('../../subcommands/link');
const { messageSubCommand, messageSubFunction } = require('../../subcommands/message');
const { embedColorSubComand, embedColorSubFunction } = require('../../subcommands/embedColor');
const { deleteSubCommand, deleteSubFunction } = require('../../subcommands/delete');
const { unlinkSubCommand, unlinkSubFunction } = require('../../subcommands/unlink');
const { languageSubCommand, languageSubFunction } = require('../../subcommands/language');

module.exports = {
    premium: true,
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Select a setting to change it.')
        .setDescriptionLocalizations({ nl: 'Kies een setting om hem te veranderen.' })
        .addSubcommand(linkSubCommand)
        .addSubcommand(messageSubCommand)
        .addSubcommand(embedColorSubComand)
        .addSubcommand(deleteSubCommand)
        .addSubcommand(unlinkSubCommand)
        .addSubcommand(languageSubCommand),

    async execute(interaction, auth, userData) {
        let subCommand = interaction.options.getSubcommand();
        if (subCommand === 'link') return linkSubFunction(interaction, auth, userData);
        if (subCommand === 'message') return messageSubFunction(interaction, auth, userData);
        if (subCommand === 'embedcolor') return embedColorSubFunction(interaction, auth, userData);
        if (subCommand === 'delete') return deleteSubFunction(interaction, auth, userData);
        if (subCommand === 'unlink') return unlinkSubFunction(interaction, auth, userData);
        if (subCommand === 'language') return languageSubFunction(interaction, auth, userData);
    }
}