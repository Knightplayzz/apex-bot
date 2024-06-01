const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { misc, logo } = require('../../../data/utilities/emoji.json');
const { sentErrorEmbed } = require('../../../utilities/functions/utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('predator')
        .setDMPermission(true)
        .setDescription('See how many points you need to reach Apex Predator on each platform.'),

    async execute(interaction, auth, langOpt) {

        await interaction.deferReply({ ephemeral: true });

        var url = encodeURI(`https://api.mozambiquehe.re/predator?auth=${auth}`);
        fetch(url)
            .then(res => { if (res.status === 200) { return res.json() } else return sentErrorEmbed(interaction, langOpt, `crafting.js l.19`) })
            .then(data => {
                var predatorEmbed = new EmbedBuilder()
                    .setTitle('Apex Predator Ranked Point Threshold')
                    .setDescription(`**Last Updated:** <t:${data.RP.PC.updateTimestamp}:R>`)
                    .addFields([
                        {
                            name: `${logo.PC} PC (Steam/Origins)`,
                            value: `${misc.grey_dot} Threshold: ${data.RP.PC.val.toLocaleString()} RP\n${misc.grey_dot} Player Count: ${data.RP.PC.totalMastersAndPreds.toLocaleString()}`,
                            inline: true
                        },
                        {
                            name: `${logo.PS4} PlayStation`,
                            value: `${misc.grey_dot} Threshold: ${data.RP.PS4.val.toLocaleString()} RP\n${misc.grey_dot} Player Count: ${data.RP.PS4.totalMastersAndPreds.toLocaleString()}`,
                            inline: true
                        },
                        {
                            name: '\u200b',
                            value: '\u200b',
                            inline: true,
                        },
                        {
                            name: `${logo.X1} Xbox`,
                            value: `${misc.grey_dot} Threshold: ${data.RP.X1.val.toLocaleString()} RP\n${misc.grey_dot} Player Count: ${data.RP.X1.totalMastersAndPreds.toLocaleString()}`,
                            inline: true
                        },
                        {
                            name: `${logo.Switch} Nintendo Switch`,
                            value: `${misc.grey_dot} Threshold: ${data.RP.SWITCH.val.toLocaleString()} RP\n${misc.grey_dot} Player Count: ${data.RP.SWITCH.totalMastersAndPreds.toLocaleString()}`,
                            inline: true
                        },
                        {
                            name: '\u200b',
                            value: '\u200b',
                            inline: true,
                        }])
                    .setFooter({ text: 'RP Threshold data provided by https://apexlegendsstatus.com.' })
                    .setColor("#2B2D31");

                interaction.editReply({ embeds: [predatorEmbed], ephemeral: true });

            }).catch(error => { sentErrorEmbed(interaction, langOpt, error) })
    }
}
