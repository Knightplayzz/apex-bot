const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { misc, logo } = require('../../../data/utilities/emoji.json');
const { handleError } = require('../../../utilities/functions/utilities');
const lang = require('../../../data/lang/lang.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('predator')
        .setDescription('See how many points you need to reach Apex Predator on each platform.')
        .setDescriptionLocalizations({ nl: 'Zie hoeveel punten je nodig hebt om Apex Predator te bereiken op elk platform.' }),

    async execute(interaction, auth, userData) {

        var langOpt = userData.lang;
        await interaction.deferReply({ ephemeral: userData.invisible });

        var url = encodeURI(`https://api.mozambiquehe.re/predator?auth=${auth}`);
        fetch(url)
            .then(res => {
                if (res.status === 200) { return res.json() } else {
                    handleError(interaction, userData, res.status);
                    return Promise.reject('Error occurred');
                }
            })
            .then(data => {

                var predatorEmbed = new EmbedBuilder()
                    .setTitle(`${lang[langOpt].predator.line_1}`)
                    .setDescription(`**${lang[langOpt].predator.line_2}:** <t:${data.RP.PC.updateTimestamp}:R>`)
                    .addFields([
                        {
                            name: `${logo.PC} PC (Steam/Origins)`,
                            value: `${misc.grey_dot} ${lang[langOpt].predator.line_3}: ${data.RP.PC.val.toLocaleString()} RP\n${misc.grey_dot} ${lang[langOpt].predator.line_4}: ${data.RP.PC.totalMastersAndPreds.toLocaleString()}`,
                            inline: true
                        },
                        {
                            name: `${logo.PS4} PlayStation`,
                            value: `${misc.grey_dot} ${lang[langOpt].predator.line_3}: ${data.RP.PS4.val.toLocaleString()} RP\n${misc.grey_dot} ${lang[langOpt].predator.line_4}: ${data.RP.PS4.totalMastersAndPreds.toLocaleString()}`,
                            inline: true
                        },
                        {
                            name: '\u200b',
                            value: '\u200b',
                            inline: true,
                        },
                        {
                            name: `${logo.X1} Xbox`,
                            value: `${misc.grey_dot} ${lang[langOpt].predator.line_3}: ${data.RP.X1.val.toLocaleString()} RP\n${misc.grey_dot} ${lang[langOpt].predator.line_4}: ${data.RP.X1.totalMastersAndPreds.toLocaleString()}`,
                            inline: true
                        },
                        {
                            name: `${logo.Switch} Nintendo Switch`,
                            value: `${misc.grey_dot} ${lang[langOpt].predator.line_3}: ${data.RP.SWITCH.val.toLocaleString()} RP\n${misc.grey_dot} ${lang[langOpt].predator.line_4}: ${data.RP.SWITCH.totalMastersAndPreds.toLocaleString()}`,
                            inline: true
                        },
                        {
                            name: '\u200b',
                            value: '\u200b',
                            inline: true,
                        }])
                    .setFooter({ text: `${lang[langOpt].predator.line_5} https://apexlegendsstatus.com.` })
                    .setColor(userData.embedColor);

                interaction.editReply({ embeds: [predatorEmbed], ephemeral: userData.invisible });
            }).catch(error => { console.error('Fetch error:', error) });
    }
}