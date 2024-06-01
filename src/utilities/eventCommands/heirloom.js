const { EmbedBuilder } = require('discord.js');
const nameArray = require("../../data/legends/misc/heirloomUrl.json");

module.exports = {
    async execute(interaction, langOpt, timers) {

        if (timers[interaction.message.interaction.id]) clearTimeout(timers[interaction.message.interaction.id]);
        timers[interaction.message.interaction.id] = setTimeout(() => {
            interaction.editReply({ components: [] })
        }, 10000);

        let legendImage = Number(interaction.values[0])
        legendImage--

        var botEmbed = new EmbedBuilder()
            .setTitle(nameArray[legendImage].name)
            .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
            .setImage(nameArray[legendImage].url)
            .setTimestamp()
        interaction.update({ embeds: [botEmbed], ephemeral: true })
    }
}