const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { version } = require('../../../../package.json');
const { sentErrorEmbed } = require('../../../utilities/functions/utilities');
const lang = require('../../../data/lang/lang.json');
const os = require('os');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Shows info about the bot.')
        .setDescriptionLocalizations({ nl: 'Zie informatie van de bot.' }),

    async execute(interaction, auth, userData) {

        var langOpt = userData.lang;
        await interaction.deferReply({ ephemeral: userData.invisible });

        interaction.client.shard.fetchClientValues('guilds.cache.size')
            .then(results => {
                let guildCount = results.reduce((acc, guildCount) => acc + guildCount, 0);

                const uptime = process.uptime();
                const seconds = Math.floor(uptime % 60);
                const minutes = Math.floor((uptime % (60 * 60)) / 60);
                const hours = Math.floor(uptime / (60 * 60)) % 24;
                const days = Math.floor(uptime / 86400);

                const commandAmount = 50;

                var infoEmbed = new EmbedBuilder()
                    .setTitle(`Apex Legends Bot`)
                    .setDescription(`${lang[langOpt].info.line_1}`)
                    .setColor(userData.embedColor)
                    .setThumbnail(interaction.guild.iconURL({ format: 'png' }))
                    .addFields([
                        { inline: true, name: '🌐 Servers', value: `${guildCount.toLocaleString()}` },
                        { inline: true, name: '☢ Ping', value: `${interaction.client.ws.ping}ms` },
                        { inline: true, name: '🏃‍♂️ Specs Info', value: `Cores: ${os.cpus().length}` },
                        {
                            name: 'Links',
                            value: `[Patreon](https://patreon.com/user?u=82758535)\n[GitHub](https://github.com/Knightplayzz/)\n[Support Server](${process.env.discordInvite})`,
                            inline: true,
                        },
                        {
                            name: 'Bot Info',
                            value: `Shard ${interaction.client.shard.ids[0] + 1}/${interaction.client.shard.count}\nVersion ${version}\n ${commandAmount}+ Commands`,
                            inline: true,
                        },
                        {
                            name: 'Uptime',
                            value: `${days}d, ${hours}h, ${minutes}m, ${seconds}s`,
                            inline: true,
                        },
                    ])
                    .setFooter({ text: `${lang[langOpt].info.line_2}` });

                interaction.editReply({ embeds: [infoEmbed], ephemeral: userData.invisible });
            }).catch(error => { sentErrorEmbed(interaction, langOpt, error) });
    }
}