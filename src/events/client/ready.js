const cron = require('node-cron');
const timedInteraction1 = require(`../../utilities/timedEvents/botStatus.js`);
const setGuildCount = require("../../utilities/functions/setGuildCount.js");

module.exports = {
    name: "ready",
    once: true,
    async execute(client, auth) {
        console.log(`${client.user.username} is online.`);
        cron.schedule('* * * * *', () => { timedInteraction1.execute(client, auth) });
        setGuildCount.execute(client, auth);
    }
}