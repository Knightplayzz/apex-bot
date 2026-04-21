const { EmbedBuilder } = require('discord.js');
const { deleteField, doc, updateDoc } = require('firebase/firestore');
const lang = require('../../data/lang/lang.json');
const { getDb } = require('../../utilities/functions/firebase');

const unlinkSubCommand = subCommand =>
    subCommand
        .setName('unlink')
        .setDescription('Unlink your Discord account from your Apex username.')
        .setDescriptionLocalizations({
            nl: 'Ontkoppel je Discord account van je Apex gebruikersnaam.',
        });

const unlinkSubFunction = async (interaction, userData) => {
    const langOpt = userData.lang;

    const unlinkedEmbed = new EmbedBuilder()
        .setTitle(lang[langOpt].stats.line_5)
        .setDescription(
            `${lang[langOpt].stats.line_18}` + `\n**${userData.username}** [${userData.platform}]`
        )
        .setFooter({
            text: `${interaction.client.user.username} :heart:`,
            iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setTimestamp()
        .setColor('Green');

    const notLinkedEmbed = new EmbedBuilder()
        .setTitle(lang[langOpt].stats.line_1)
        .setDescription(`${lang[langOpt].stats.line_17}!`)
        .setFooter({
            text: `${interaction.client.user.username} :heart:`,
            iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setTimestamp()
        .setColor('Red');

    if (!userData.platform || !userData.username) {
        return interaction.editReply({ embeds: [notLinkedEmbed], ephemeral: userData.invisible });
    }

    await updateDoc(doc(getDb(), 'users', interaction.user.id), {
        platform: deleteField(),
        username: deleteField(),
    });

    return interaction.editReply({ embeds: [unlinkedEmbed], ephemeral: userData.invisible });
};

module.exports = {
    unlinkSubCommand,
    unlinkSubFunction,
};
