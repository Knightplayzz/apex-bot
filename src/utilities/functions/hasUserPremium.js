const { hasUserVoted } = require('./utilities');
const { createTtlCache } = require('./cache');
const logger = require('./logger').child({ module: 'premium' });

const USER_PREMIUM_SKU = '1246777340806303866';
const SERVER_PREMIUM_SKU = '1247194389281902683';
const premiumCache = createTtlCache({ ttlMs: 2 * 60 * 1000, maxSize: 2000 });

async function fetchPremiumState(interaction) {
    const userEntitlementsPromise = interaction.client.application.entitlements.fetch(
        interaction.user
    );
    const guildEntitlementsPromise = interaction.guild
        ? interaction.client.application.entitlements.fetch(interaction.guild)
        : Promise.resolve(null);

    const [userEntitlements, guildEntitlements] = await Promise.all([
        userEntitlementsPromise,
        guildEntitlementsPromise,
    ]);

    const isUserPremium = userEntitlements.some(
        entitlement =>
            entitlement.skuId === USER_PREMIUM_SKU && entitlement.userId === interaction.user.id
    );

    const isServerPremium =
        guildEntitlements?.some(
            entitlement =>
                entitlement.skuId === SERVER_PREMIUM_SKU &&
                entitlement.guildId === interaction.guild.id
        ) ?? false;

    if (isUserPremium || isServerPremium) return true;
    return hasUserVoted(interaction);
}

async function hasUserPremium(interaction) {
    const cacheKey = `${interaction.user.id}:${interaction.guild?.id || 'dm'}`;

    try {
        return await premiumCache.getOrSet(cacheKey, () => fetchPremiumState(interaction));
    } catch (error) {
        logger.warn('Premium check failed; falling back to vote check', {
            error,
            guildId: interaction.guild?.id,
            userId: interaction.user.id,
        });
        return hasUserVoted(interaction);
    }
}

module.exports = { hasUserPremium };
