const setGuildCount = require("../../utilities/functions/setGuildCount");

module.exports = {
    name: "guildDelete",
    once: false,
    async execute(guildDelete, auth) {

        console.log(`${guildDelete.client.user.username} REMOVED: ${guildDelete.name} (${guildDelete.id})\nCount: Is being set.`);
        setGuildCount.execute(guild.client, auth);
    }
}