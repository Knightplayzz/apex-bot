const { ActivityType } = require('discord.js');
const fetch = require('node-fetch')
const { handleError } = require('../functions/utilities');

async function setMapData(client, auth) {
    var url = encodeURI(`https://api.mozambiquehe.re/maprotation?auth=${auth}`);
    fetch(url)
        .then(res => {
            if (res.status === 200) { return res.json() } else {
                handleError(interaction, langOpt, res.status)
                return Promise.reject('Error occurred');
            }
        })
        .then(data => {
            if (data.current === undefined) return //check because HUGO is to lazy to fix the issue :D. IF check at same time data is being writen data= empty
            var timeDay = Math.round(Number(data.current.remainingMins) / 1440); //here error
            var hours = Number(data.current.remainingMins) / 60;

            if (timeDay >= 2) {
                const time2 = Number(data.current.remainingMins) / 1440;
                const time3 = Math.round(time2);
                client.user.setActivity(`${data.current.map} [${time3} days]`, { type: ActivityType.Custom });
            }
            if (timeDay <= 1 && hours >= 2) {
                let time = data.current.remainingMins / 60;
                let time2 = Math.round(time);
                client.user.setActivity(`${data.current.map} [${time2} hours]`, { type: ActivityType.Custom });
            }
            if (hours < 2) {
                client.user.setActivity(`${data.current.map} [${data.current.remainingMins} min]`, { type: ActivityType.Custom });
            }
        }).catch(error => { console.error('Fetch error:', error) })
}
module.exports = { setMapData };