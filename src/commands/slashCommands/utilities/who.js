const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lang = require('../../../data/lang/lang.json');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('who')
        .setDescription('Picks a random legend to play in-game.')
        .setDescriptionLocalizations({ nl: 'Kiest een willekeurige legend om in-game te gebruiken.' })
        .addStringOption(option =>
            option.setName('class')
                .setDescription('Category of legends to choose from.')
                .setDescriptionLocalizations({ nl: 'Categorie aan legends om van te kiezen.' })
                .setRequired(false)
                .addChoices(
                    { name: 'Assault', value: 'assault' },
                    { name: 'Skirmisher', value: 'skirmisher' },
                    { name: 'Recon', value: 'recon' },
                    { name: 'Controller', value: 'controller' },
                    { name: 'Support', value: 'support' }
                )),

    async execute(interaction, auth, userData) {

        var langOpt = userData.lang;
        await interaction.deferReply({ ephemeral: userData.invisible });

        const type = interaction.options.getString('type');
        if (!type) {
            legendFile = require('../../../data/legends/all.json');
        } else legendFile = require(`../../../data/legends/${type}.json`);

        const legend = Math.floor(Math.random() * legendFile.length);

        var legendEmbed = new EmbedBuilder()
            .setDescription(`${lang[langOpt].who.line_1} **${legendFile[legend]}** ${lang[langOpt].who.line_2}!`)
            .setImage(`https://specter.apexstats.dev/ApexStats/Legends/${encodeURIComponent(legendFile[legend])}.png?t=9&key=${process.env.messageToken}`)
            .setColor(userData.embedColor)
            .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        interaction.editReply({ embeds: [legendEmbed], ephemeral: userData.invisible });
    }
}