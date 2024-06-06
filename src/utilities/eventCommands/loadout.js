const { EmbedBuilder } = require('discord.js');
const weapons = require("../../data/weapons/allWeapons.json");

module.exports = {
    async execute(interaction, userData) {
        var loadoutEmbed = EmbedBuilder.from(interaction.message.embeds[0]).setImage(weapons[interaction.values[0]].url);
        interaction.update({ embeds: [loadoutEmbed], ephemeral: userData.invisible });
    }
}