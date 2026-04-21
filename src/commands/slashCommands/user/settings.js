const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const { linkSubCommand, linkSubFunction } = require('../../subcommands/link');
const { messageSubCommand, messageSubFunction } = require('../../subcommands/message');
const { deleteSubCommand, deleteSubFunction } = require('../../subcommands/delete');
const { unlinkSubCommand, unlinkSubFunction } = require('../../subcommands/unlink');
const { languageSubCommand, languageSubFunction } = require('../../subcommands/language');
const {
    embedColorCustomSubCommand,
    embedColorCustomSubFunction,
    autocomplete: embedColorCustomAutocomplete,
} = require('../../subcommands/embedColor/embedColorCustom');
const { safeRespond } = require('../../../utilities/functions/interactions');
const logger = require('../../../utilities/functions/logger').child({ module: 'settingsCommand' });

module.exports = {
    premium: true,
    data: new SlashCommandBuilder()
        .setName('settings')
        .setContexts(InteractionContextType.Guild)
        .setDescription('Select a setting to change it.')
        .setDescriptionLocalizations({ nl: 'Kies een setting om hem te veranderen.' })
        .addSubcommand(linkSubCommand)
        .addSubcommand(messageSubCommand)
        .addSubcommand(deleteSubCommand)
        .addSubcommand(unlinkSubCommand)
        .addSubcommand(languageSubCommand)
        .addSubcommandGroup(group =>
            group
                .setName('embedcolor')
                .setDescription('Adjust embed color settings')
                .addSubcommand(embedColorCustomSubCommand)
        ),

    async execute(interaction, auth, userData) {
        const subCommand = interaction.options.getSubcommand();

        const subCommandMap = {
            link: (subInteraction, subUserData) =>
                linkSubFunction(subInteraction, auth, subUserData),
            message: messageSubFunction,
            delete: deleteSubFunction,
            unlink: unlinkSubFunction,
            language: languageSubFunction,
            custom: embedColorCustomSubFunction,
        };

        const subCommandFunction = subCommandMap[subCommand];
        if (subCommandFunction) {
            if (subCommand !== 'message')
                await interaction.deferReply({ ephemeral: userData.invisible });
            return subCommandFunction(interaction, userData);
        }

        logger.warn('Unknown settings subcommand', { subCommand, userId: interaction.user.id });
        return safeRespond(interaction, { content: 'Unknown subcommand', ephemeral: true });
    },

    autocomplete(interaction) {
        const subCommand = interaction.options.getSubcommand();
        if (subCommand === 'custom') {
            return embedColorCustomAutocomplete(interaction);
        }
        return null;
    },
};
