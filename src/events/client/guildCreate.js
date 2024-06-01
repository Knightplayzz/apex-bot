const setGuildCount = require("../../utilities/functions/setGuildCount");

module.exports = {
    name: "guildCreate",
    once: false,
    async execute(guild, auth) {
        console.log(`${guild.client.user.username} ADDED: ${guild.name} (${guild.id})\nCount: Is being set.`);
        setGuildCount.execute(guild.client, auth);
    }
}