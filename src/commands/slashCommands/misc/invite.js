const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const lang = require('../../../data/lang/lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDMPermission(true)
        .setDescription('Provides an invite link for the bot.')
        .setDescriptionLocalizations({ nl: 'Toont een invite link van de bot.' }),

    async execute(interaction, auth, userData) {

        var langOpt = userData.lang;
        await interaction.deferReply({ ephemeral: userData.invisible });

        var inviteEmbed = new EmbedBuilder()
            .setTitle(`${interaction.client.user.username} :heart: `)
            .setDescription(
                `${lang[langOpt].invite.line_1} ${interaction.client.user.username}` +
                `\n${lang[langOpt].invite.line_2}(https://discord.com/api/oauth2/authorize?client_id=1014207340188270673&permissions=8&scope=bot%20applications.commands) ${lang[langOpt].invite.line_3}.`
            )
            .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
            .setColor(userData.embedColor)
            .setTimestamp();

        interaction.editReply({ embeds: [inviteEmbed], ephemeral: userData.invisible });
    }
}
