const { EmbedBuilder } = require('discord.js');
const { doc, setDoc } = require('firebase/firestore');
const lang = require('../../data/lang/lang.json');
const { checkData, handleError } = require('../../utilities/functions/utilities');
const { fetchJson } = require('../../utilities/functions/http');
const { getDb } = require('../../utilities/functions/firebase');

const linkSubCommand = subCommand =>
    subCommand
        .setName('link')
        .setDescription('Link your Discord account to your Apex Legends username.')
        .setDescriptionLocalizations({
            nl: 'Koppel je Discord account aan je Apex Legends gebruikersnaam.',
        })
        .addStringOption(option =>
            option
                .setName('platform')
                .setDescription('The platform you play Apex on.')
                .setDescriptionLocalizations({ nl: 'Het platform waarop je Apex speelt.' })
                .setRequired(true)
                .addChoices(
                    { name: 'PC(Steam/Origin)', value: 'PC' },
                    { name: 'PlayStation', value: 'PS4' },
                    { name: 'Xbox', value: 'X1' }
                )
        )
        .addStringOption(option =>
            option
                .setName('username')
                .setDescription('Your in-game username.')
                .setDescriptionLocalizations({ nl: 'Je in-game gebruikersnaam.' })
                .setRequired(true)
        );

const linkSubFunction = async (interaction, auth, userData) => {
    const langOpt = userData.lang;
    const platform = interaction.options.get('platform').value;
    const player = interaction.options.getString('username');

    const alreadyLinkedEmbed = new EmbedBuilder()
        .setTitle(`${lang[langOpt].link.line_1}`)
        .setDescription(
            `${lang[langOpt].link.line_2}:` + `\n**${userData.username}** [${userData.platform}]`
        )
        .setFooter({
            text: `${interaction.client.user.username} :heart:`,
            iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setTimestamp()
        .setColor('Red');

    if (userData.platform && userData.username) {
        return interaction.editReply({
            embeds: [alreadyLinkedEmbed],
            ephemeral: userData.invisible,
        });
    }

    const url = encodeURI(
        `https://api.mozambiquehe.re/bridge?version=5&platform=${platform}&player=${player}&auth=${auth}`
    );
    const data = await fetchJson(url, {
        label: 'Apex player lookup',
        timeoutMs: 10_000,
    }).catch(error => handleError(interaction, userData, error));

    checkData(data, interaction, userData);

    const linkedEmbed = new EmbedBuilder()
        .setTitle(`${lang[langOpt].link.line_3}`)
        .setDescription(`${lang[langOpt].link.line_4}:` + `\n**${data.global.name}** [${platform}]`)
        .setFooter({
            text: `${interaction.client.user.username} :heart:`,
            iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setTimestamp()
        .setColor('Green');

    await setDoc(
        doc(getDb(), 'users', interaction.user.id),
        {
            platform,
            username: data.global.name,
        },
        { merge: true }
    );

    return interaction.editReply({ embeds: [linkedEmbed], ephemeral: userData.invisible });
};

module.exports = {
    linkSubCommand,
    linkSubFunction,
};
