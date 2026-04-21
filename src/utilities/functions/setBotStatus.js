const { ActivityType } = require('discord.js');
const { fetchJson } = require('./http');
const logger = require('./logger').child({ module: 'botStatus' });

async function setMapData(client, auth) {
    const url = encodeURI(`https://api.mozambiquehe.re/maprotation?auth=${auth}`);

    try {
        const data = await fetchJson(url, {
            cacheKey: 'apex:status-maprotation',
            cacheTtlMs: 30 * 1000,
            label: 'Apex map rotation for bot status',
            timeoutMs: 10_000,
        });

        if (data.current === undefined) {
            logger.warn('Map rotation response did not include current map');
            return;
        }

        client.user.setActivity(formatActivity(data.current), { type: ActivityType.Custom });
    } catch (error) {
        logger.warn('Failed to set bot map status', { error });
    }
}

function formatActivity(currentMap) {
    const remainingMins = Number(currentMap.remainingMins);
    const days = Math.floor(remainingMins / 1440);
    const hours = Math.ceil(remainingMins / 60);

    if (days >= 2) return `${currentMap.map} [${days} days]`;
    if (days === 1 || hours >= 2) return `${currentMap.map} [${hours} hours]`;
    return `${currentMap.map} [${remainingMins} min]`;
}

module.exports = { setMapData };
