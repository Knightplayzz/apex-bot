const fetch = require('node-fetch');

module.exports = {
    async execute(client) {

        client.shard.fetchClientValues('guilds.cache.size')
            .then(results => {

                const guildCount = results.reduce((acc, guildCount) => acc + guildCount, 0);

                try {
                    const guildApexServ = client.guilds.cache.get("1018244995792257114");
                    const guildCountChannel = guildApexServ.channels.cache.get("1024393334007009391")
                    guildCountChannel.setName("Servers Active: " + guildCount.toString())
                } catch (error) { console.log(error) }

                const data = {
                    "server_count": guildCount,
                    "shard_count": client.shard.count
                };
                fetch('https://top.gg/api/bots/1014207340188270673/stats', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { "Content-Type": "application/json", "Authorization": process.env.topgg_AUTH }
                }).catch(error => { console.log(error) });
            }).catch(error => { console.log(error) });
    }
}