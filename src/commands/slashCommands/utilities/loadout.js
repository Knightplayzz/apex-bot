const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const lang = require('../../../data/lang/lang.json');
const weapons = require("../../../data/weapons/allWeapons.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loadout')
        .setDescription('Picks a random loadout to use in-game.')
        .setDescriptionLocalizations({ nl: 'Kiest een willekeurige loadout om in-game te gebruiken.' }),

    async execute(interaction, auth, userData) {

        const langOpt = userData.lang;
        await interaction.deferReply({ ephemeral: userData.invisible });

        const y = weapons.length;
        var uniqueNumbers = [];

        while (uniqueNumbers.length < 3) {
            var randomNumber = Math.floor(Math.random() * y);
            if (!uniqueNumbers.includes(randomNumber)) {
                uniqueNumbers.push(randomNumber);
            }
        }

        const value1 = uniqueNumbers[0].toString();
        const value2 = uniqueNumbers[1].toString();

        const select = new StringSelectMenuBuilder()
            .setCustomId('loadout')
            .setPlaceholder('Make a selection!')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(weapons[uniqueNumbers[0]].name)
                    .setDescription(weapons[uniqueNumbers[0]].description)
                    .setValue(value1),
                new StringSelectMenuOptionBuilder()
                    .setLabel(weapons[uniqueNumbers[1]].name)
                    .setDescription(weapons[uniqueNumbers[1]].description)
                    .setValue(value2),
            );
        const row = new ActionRowBuilder()
            .addComponents(select);

        const loadoutEmbed = new EmbedBuilder()
            .setDescription(`${lang[langOpt].loadout.line_2} **${weapons[uniqueNumbers[0]].name}** ${lang[langOpt].loadout.line_1} **${weapons[uniqueNumbers[1]].name}** ${lang[langOpt].loadout.line_3}!`)
            .setImage(weapons[uniqueNumbers[0]].url)
            .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
            .setColor(userData.embedColor)
            .setTimestamp();

        interaction.editReply({ embeds: [loadoutEmbed], components: [row], ephemeral: userData.invisible });
    }
}