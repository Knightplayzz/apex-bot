const { EmbedBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder } = require('discord.js');
const lang = require('../../data/lang/lang.json');

module.exports = {
    async execute(interaction, langOpt) {

        console.log(interaction.values[0]);

        const bugModal = new ModalBuilder()
            .setCustomId("bugReport")
            .setTitle("Bug Report");

        const commandInput = new TextInputBuilder()
            .setCustomId("commandInput")
            .setLabel(`${lang[langOpt].report.line_1}?`)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder(`${lang[langOpt].report.line_1}?`)
            .setValue(interaction.values[0]);

        const messageInput = new TextInputBuilder()
            .setCustomId("messageInput")
            .setLabel(`${lang[langOpt].report.line_2}?`)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setPlaceholder(`${lang[langOpt].report.line_1}`);

        const firstActionRow = new ActionRowBuilder().addComponents(commandInput);
        const secondActionRow = new ActionRowBuilder().addComponents(messageInput);
        bugModal.addComponents(firstActionRow, secondActionRow);

        await interaction.showModal(bugModal);

        let botEmbed = new EmbedBuilder()
            .setTitle(`${lang[langOpt].report.line_5} ${interaction.values[0]}`)
            .setDescription(`${lang[langOpt].report.line_6}: ${interaction.values[0]}` +
                `\n${lang[langOpt].report.line_7}.` +
                `\n${lang[langOpt].report.line_8}.`)
            .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()

        interaction.editReply({ components: [], embeds: [botEmbed], ephemeral: true })
    }
}