const { EmbedBuilder } = require('discord.js');
const lang = require('../../data/lang/lang.json');
const weapons = require("../../data/weapons/allWeapons.json");

module.exports = {
    async execute(interaction, langOpt) {
        var x = interaction.values[0];
        var loadoutEmbed = new EmbedBuilder()
            .setDescription(`${lang[langOpt].loadout.line_2} **${weapons[x].name}** ${lang[langOpt].loadout.line_3}!`)
            .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
            .setImage(weapons[x].url)
            .setTimestamp();

        interaction.update({ embeds: [loadoutEmbed], ephemeral: true });
    }
}