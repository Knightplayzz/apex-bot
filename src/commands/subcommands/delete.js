const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const lang = require('../../data/lang/lang.json');

const deleteSubCommand = (subCommand) => subCommand
    .setName('delete')
    .setDescription('delete all settings.');

const deleteSubFunction = async (interaction, userData) => {

    const langOpt = userData.lang;

    const embed = new EmbedBuilder()
        .setTitle(`${lang[langOpt].settings.line_4}`)
        .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp()
        .setColor('Red');

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel(`${lang[langOpt].settings.line_5}`)
                .setCustomId('1')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setLabel(`${lang[langOpt].settings.line_6}`)
                .setCustomId('2')
                .setStyle(ButtonStyle.Success)
        );

    interaction.editReply({ embeds: [embed], components: [row], ephemeral: userData.invisible });
}

module.exports = {
    deleteSubCommand: deleteSubCommand,
    deleteSubFunction: deleteSubFunction
};