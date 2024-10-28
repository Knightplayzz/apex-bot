const { hasUserVoted } = require('./utilities');
const { embedColor } = require('../../data/utilities/utilities.json');

async function hasUserPremium(interaction) {

    var isServerPremium, isUserPremium;

    const userEntitlements = await interaction.client.application.entitlements.fetch(interaction.user);
    userEntitlements.forEach(async data => { if (data.skuId === '1246777340806303866' && data.userId === interaction.user.id) isUserPremium = true });

    if (interaction.guild) {
        const entitlements = await interaction.client.application.entitlements.fetch(interaction.guild);
        entitlements.forEach(async data => { if (data.skuId === '1247194389281902683' && data.guildId === interaction.guild.id) isServerPremium = true; })
    }
    if (isServerPremium == undefined && isUserPremium == undefined) {
        let hasUserVotedVar = await hasUserVoted(interaction, { invisible: true, lang: 'en', embedColor: embedColor });
        return hasUserVotedVar
    } else return true;
}
module.exports = { hasUserPremium };