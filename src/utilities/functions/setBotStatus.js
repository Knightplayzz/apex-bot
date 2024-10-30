const { ActivityType } = require('discord.js');
const fetch = require('node-fetch')
const { handleError } = require('../functions/utilities');

async function setMapData(client, auth) {
    const url = encodeURI(`https://api.mozambiquehe.re/maprotation?auth=${auth}`);
    fetch(url)
        .then(res => res.status === 200 ? res.json() : handleError(interaction, userData, res.status))
        .then(data => {

            if (data.current === undefined) return console.log('error retrieving map for status');

            const days = Math.round(Number(data.current.remainingMins) / 1440);
            const hours = Number(data.current.remainingMins) / 60;
            var activityMessage;

            if (days >= 2) {
                activityMessage = `${data.current.map} [${days} days]`;
            } else if (days === 1 || hours >= 2) {
                activityMessage = `${data.current.map} [${hours} hours]`;
            } else {
                activityMessage = `${data.current.map} [${data.current.remainingMins} min]`;
            }

            client.user.setActivity(activityMessage, { type: ActivityType.Custom });

        }).catch(error => { console.error('Fetch error:', error) });
}
module.exports = { setMapData };