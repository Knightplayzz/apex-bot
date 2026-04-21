const {
    EmbedBuilder,
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} = require('discord.js');
const lang = require('../../../data/lang/lang.json');
const weapons = require('../../../data/weapons/allWeapons.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loadout')
        .setDescription('Picks a random loadout to use in-game.')
        .setDescriptionLocalizations({
            nl: 'Kiest een willekeurige loadout om in-game te gebruiken.',
        }),

    async execute(interaction, auth, userData) {
        const langOpt = userData.lang;
        await interaction.deferReply({ ephemeral: userData.invisible });

        const uniqueNumbers = pickUniqueIndexes(weapons.length, 2);
        const [firstWeaponIndex, secondWeaponIndex] = uniqueNumbers;

        const select = new StringSelectMenuBuilder()
            .setCustomId('loadout')
            .setPlaceholder('Make a selection!')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(weapons[firstWeaponIndex].name)
                    .setDescription(weapons[firstWeaponIndex].description)
                    .setValue(firstWeaponIndex.toString()),
                new StringSelectMenuOptionBuilder()
                    .setLabel(weapons[secondWeaponIndex].name)
                    .setDescription(weapons[secondWeaponIndex].description)
                    .setValue(secondWeaponIndex.toString())
            );
        const row = new ActionRowBuilder().addComponents(select);

        const loadoutEmbed = new EmbedBuilder()
            .setDescription(
                `${lang[langOpt].loadout.line_2} **${weapons[firstWeaponIndex].name}** ${lang[langOpt].loadout.line_1} **${weapons[secondWeaponIndex].name}** ${lang[langOpt].loadout.line_3}!`
            )
            .setImage(weapons[firstWeaponIndex].url)
            .setFooter({
                text: `${interaction.client.user.username} :heart:`,
                iconURL: interaction.client.user.displayAvatarURL(),
            })
            .setColor(userData.embedColor)
            .setTimestamp();

        return interaction.editReply({
            embeds: [loadoutEmbed],
            components: [row],
            ephemeral: userData.invisible,
        });
    },
};

function pickUniqueIndexes(max, count) {
    const indexes = new Set();
    while (indexes.size < count) {
        indexes.add(Math.floor(Math.random() * max));
    }
    return [...indexes];
}
