const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { version } = require('../../../../package.json');
const lang = require('../../../data/lang/lang.json');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Shows info about the bot.')
        .setDescriptionLocalizations({ nl: 'Zie informatie van de bot.' }),

    async execute(interaction, auth, userData) {
        const langOpt = userData.lang;
        await interaction.deferReply({ ephemeral: userData.invisible });

        const guildCount = await getGuildCount(interaction.client);
        const uptime = getUptimeParts(process.uptime());
        const commandAmount = interaction.client.slashCommands.size;
        const shardLabel = interaction.client.shard
            ? `Shard ${interaction.client.shard.ids[0] + 1}/${interaction.client.shard.count}`
            : 'Shard 1/1';

        const infoEmbed = new EmbedBuilder()
            .setTitle('Apex Legends Bot')
            .setDescription(`${lang[langOpt].info.line_1}`)
            .setColor(userData.embedColor)
            .setThumbnail(
                interaction.guild?.iconURL({ extension: 'png' }) ??
                    interaction.client.user.displayAvatarURL()
            )
            .addFields([
                { inline: true, name: 'Servers', value: `${guildCount.toLocaleString()}` },
                { inline: true, name: 'Ping', value: `${interaction.client.ws.ping}ms` },
                { inline: true, name: 'Specs Info', value: `Cores: ${os.cpus().length}` },
                {
                    name: 'Links',
                    value: `[Patreon](https://patreon.com/user?u=82758535)\n[GitHub](https://github.com/Knightplayzz/)\n[Support Server](${process.env.discordInvite})`,
                    inline: true,
                },
                {
                    name: 'Bot Info',
                    value: `${shardLabel}\nVersion ${version}\n${commandAmount}+ Commands`,
                    inline: true,
                },
                {
                    name: 'Uptime',
                    value: `${uptime.days}d, ${uptime.hours}h, ${uptime.minutes}m, ${uptime.seconds}s`,
                    inline: true,
                },
            ])
            .setFooter({ text: `${lang[langOpt].info.line_2}` });

        return interaction.editReply({ embeds: [infoEmbed], ephemeral: userData.invisible });
    },
};

async function getGuildCount(client) {
    if (!client.shard) return client.guilds.cache.size;

    const results = await client.shard.fetchClientValues('guilds.cache.size');
    return results.reduce((acc, guildCount) => acc + guildCount, 0);
}

function getUptimeParts(uptime) {
    return {
        seconds: Math.floor(uptime % 60),
        minutes: Math.floor((uptime % (60 * 60)) / 60),
        hours: Math.floor(uptime / (60 * 60)) % 24,
        days: Math.floor(uptime / 86400),
    };
}
