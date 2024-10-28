const { ActivityType } = require('discord.js');
const { setMapData } = require('../functions/setBotStatus');
const { sleep } = require('../../utilities/functions/utilities');

module.exports = {
    async execute(client, auth) {

        await sleep(5000);

        //check for old activity
        let oldActivity = client.user.presence.activities[0];
        if (!oldActivity) return setMapData(client, auth);

        //check for [] in activity
        let match = oldActivity.name.match(/\[(.*?)\]/);
        if (!match) return setMapData(client, auth);

        //check for text in the []
        let activityStr = match[1].match(/\d+/);
        if (!activityStr) return setMapData();


        let prefix = match[1].replace(activityStr[0], "").trim();
        if (!prefix === "min") return setMapData(client, auth);

        let time = parseInt(activityStr);
        if (time <= 1) return setMapData(client, auth);
        time--;

        client.user.setActivity(`${oldActivity.name.replace(match[0], "").trim()} [${time} min]`, { type: ActivityType.Custom });
    }
}