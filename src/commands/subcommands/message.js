const { EmbedBuilder } = require('discord.js');
const { doc, setDoc } = require('firebase/firestore');
const lang = require('../../data/lang/lang.json');
const { getDb } = require('../../utilities/functions/firebase');

const messageSubCommand = subCommand =>
    subCommand
        .setName('message')
        .setDescription('Whether the message is visible or not.')
        .addStringOption(option =>
            option
                .setName('option')
                .setDescription('Select if the message is visible or not.')
                .setDescriptionLocalizations({ nl: 'Kies of bericht zichtbaar moet zijn of niet.' })
                .setRequired(true)
                .addChoices(
                    { name: 'visible', value: 'visible' },
                    { name: 'invisible', value: 'invisible' }
                )
        );

const messageSubFunction = async (interaction, userData) => {
    const langOpt = userData.lang;
    const option = interaction.options.get('option').value;
    const isInvisibleBoolean = option === 'invisible';

    await interaction.deferReply({ ephemeral: isInvisibleBoolean });
    await setDoc(
        doc(getDb(), 'users', interaction.user.id),
        { invisible: isInvisibleBoolean },
        { merge: true }
    );

    const embed = new EmbedBuilder()
        .setTitle(`${lang[langOpt].settings.line_1}`)
        .setDescription(`${lang[langOpt].settings.line_2} \`\`${option}\`\`.`)
        .setFooter({
            text: `${interaction.client.user.username} :heart:`,
            iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setTimestamp()
        .setColor(userData.embedColor);

    return interaction.editReply({ embeds: [embed], ephemeral: isInvisibleBoolean });
};

module.exports = {
    messageSubCommand,
    messageSubFunction,
};
