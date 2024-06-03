const { ActivityType } = require('discord.js');
const fetch = require('node-fetch')

async function setMapData(client, auth) {
    var url = encodeURI(`https://api.mozambiquehe.re/maprotation?auth=${auth}`);
    fetch(url)
        .then(res => { if (res.status === 200) return res.json() })
        .then(data => {
            if (data.current === undefined) return console.log(`SET SATUS ERROR DATA:\n${data}`)
            var timeDay = Math.round(Number(data.current.remainingMins) / 1440); //here error
            var hours = Number(data.current.remainingMins) / 60;

            if (timeDay >= 2) {
                const time2 = Number(data.current.remainingMins) / 1440;
                const time3 = Math.round(time2);
                client.user.setActivity(`${data.current.map} [${time3} days]`, { type: ActivityType.Playing });
            }
            if (timeDay <= 1 && hours >= 2) {
                let time = data.current.remainingMins / 60;
                let time2 = Math.round(time);
                client.user.setActivity(`${data.current.map} [${time2} hours]`, { type: ActivityType.Playing });
            }
            if (hours < 2) {
                client.user.setActivity(`${data.current.map} [${data.current.remainingMins} min]`, { type: ActivityType.Playing });
            }
        }).catch(error => { console.log(error) })
}
module.exports = { setMapData };