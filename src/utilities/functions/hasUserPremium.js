const { hasUserVoted } = require('./utilities');
const { embedColor } = require('../../data/utilities/utilities.json');

async function hasUserPremium(interaction) {
    if (1 === 1) return true
    var isServerPremium, isUserPremium;
    const entitlements = await interaction.client.application.entitlements.fetch(interaction.guild);
    const userEntitlements = await interaction.client.application.entitlements.fetch(interaction.user);
    userEntitlements.forEach(async data => { if (data.skuId === '1246777340806303866' && data.userId === interaction.user.id) isUserPremium = true }); //|| data.skuId === '1014207340188270673' THIS IS USER SUBSCRIPTION
    entitlements.forEach(async data => { if (data.skuId === '1247194389281902683' && data.guildId === interaction.guild.id || data.skuId === '1246772758541631518' && data.guildId === interaction.guild.id) isServerPremium = true; }) //LIFETIME 1247194389281902683| sub 1246772758541631518
    if (isServerPremium == undefined && isUserPremium == undefined) {
        let hasUserVotedVar = await hasUserVoted(interaction, { invisible: true, lang: 'en', embedColor: embedColor });
        if (hasUserVotedVar == true) return true;
        if (hasUserVotedVar == false) return false
    } else return true;
}
module.exports = { hasUserPremium };