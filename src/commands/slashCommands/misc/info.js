const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { version } = require('../../../../package.json');
const { sentErrorEmbed } = require('../../../utilities/functions/utilities');
const os = require('os');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDMPermission(true)
        .setDescription('Shows info about the bot.'),

    async execute(interaction, auth, langOpt) {

        await interaction.deferReply({ ephemeral: true })

        interaction.client.shard.fetchClientValues('guilds.cache.size')
            .then(results => {
                let guildCount = results.reduce((acc, guildCount) => acc + guildCount, 0);

                const uptime = process.uptime();
                const seconds = Math.floor(uptime % 60);
                const minutes = Math.floor((uptime % (60 * 60)) / 60);
                const hours = Math.floor(uptime / (60 * 60)) % 24;
                const days = Math.floor(uptime / 86400);

                var infoEmbed = new EmbedBuilder()
                    .setTitle(`Apex Legends Bot`)
                    .setDescription('User and ranked stats, map rotations, news, random loadout & drop locations, and more. Start by typing `/` for a list of commands!')
                    .setColor("#2B2D31")
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
                            value: `Shard ${interaction.client.shard.ids[0] + 1}/${interaction.client.shard.count}\nVersion ${version}\n 50+ Commands`,
                            inline: true,
                        },
                        {
                            name: 'Uptime',
                            value: `${days}d, ${hours}h, ${minutes}m, ${seconds}s`,
                            inline: true,
                        },


                    ])
                    .setFooter({ text: 'Want to add the bot to your server? Click the "Apex Bot" username and press "Add to Server".' });

                interaction.editReply({ embeds: [infoEmbed], ephemeral: true });

            }).catch(error => { sentErrorEmbed(interaction, langOpt, error) })
    }
}
