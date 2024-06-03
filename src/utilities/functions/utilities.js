const { EmbedBuilder } = require("discord.js");
const lang = require('../../data/lang/lang.json');
const fetch = require('node-fetch');
require('dotenv').config();

function getStatus(data) {
    var state;
    var color;

    if (data.isOnline === 1 && data.isInGame === 0) {
        state = 'Online (Lobby)'
        color = 'Green'
    }
    if (data.isInGame === 1 && data.isOnline === 1) {
        state = 'In a Match'
        color = 'Orange'
    }
    if (data.isOnline === 0) {
        state = 'Offline'
        color = 'Black'
    }
    return { state, color }
}
function getMapDescription(gamemode, data, langOpt) {
    var title;
    var description;
    var image;
    if (gamemode === 'br') {
        title = `${lang[langOpt].map.line_1} ${data.battle_royale.current.map}`;
        description = `**${data.battle_royale.current.map}** ${lang[langOpt].map.line_2} <t:${data.battle_royale.current.end}:R> ${lang[langOpt].map.line_3} <t:${data.battle_royale.current.end}:t>.` +
            `\n**${lang[langOpt].map.line_4}:** ${data.battle_royale.next.map}`
        image = `https://specter.apexstats.dev/ApexStats/Maps/${encodeURIComponent(data.battle_royale.current.map.replace(/[\s']/g, ''))}.png`;
    }
    if (gamemode === 'ranked') {
        title = `${lang[langOpt].map.line_1} ${data.ranked.current.map}`;
        description = `**${data.ranked.current.map}** ${lang[langOpt].map.line_2} <t:${data.ranked.current.end}:R> ${lang[langOpt].map.line_3} <t:${data.ranked.current.end}:t>.` +
            `\n**${lang[langOpt].map.line_4}:** ${data.ranked.next.map}`
        image = `https://specter.apexstats.dev/ApexStats/Maps/${encodeURIComponent(data.ranked.current.map.replace(/[\s']/g, ''))}.png`;
    }
    if (gamemode === 'ltm') {
        if (data.ltm.current.isActive === true) {
            title = `${lang[langOpt].map.line_1} ${data.ltm.current.map}`;
            description = `**${data.ltm.current.map}** ${lang[langOpt].map.line_2} <t:${data.ltm.current.end}:R> ${lang[langOpt].map.line_3} <t:${data.ltm.current.end}:t>.` +
                `\n**${lang[langOpt].map.line_4}:** ${data.ltm.next.map}`
            image = `https://specter.apexstats.dev/ApexStats/Maps/${encodeURIComponent(data.ltm.current.map.replace(/[\s']/g, ''))}.png`;
        } else {
            title = `${lang[langOpt].map.line_5}`;
            description = `${lang[langOpt].map.line_6}`;
            image = null;
        }
    }
    return { title, description, image }
}
function sentErrorEmbed(interaction, langOpt, error) {
    var errorEmbed = new EmbedBuilder()
        .setDescription(`**${lang[langOpt].error.line_1}**` +
            "```" + lang[langOpt].error.line_2 + "```")
        .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp()
        .setColor("Red");

    console.log(error);
    interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
}
function sentVoteEmbed(interaction, langOpt) {
    var voteEmbed = new EmbedBuilder()
        .setTitle(`${lang[langOpt].vote.line_1}`)
        .setDescription(`${lang[langOpt].vote.line_2}(https://discord.com/application-directory/1014207340188270673).` +
            `\n${lang[langOpt].vote.line_3}(https://top.gg/bot/1014207340188270673/vote).`)
        .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp()
        .setColor("Red");

    return interaction.reply({ embeds: [voteEmbed], ephemeral: true });
}
async function hasUserVoted(interaction, langOpt) {
    if (1 === 1) return false //check if code it working
    var url = `https://top.gg/api/bots/1014207340188270673/check?userId=${interaction.user.id}`;
    try {
        const res = await fetch(url, {
            headers: { "Authorization": process.env.topgg_AUTH }
        });
        const data = await res.json();
        return data.voted === 1;
    } catch (error) {
        sentErrorEmbed(interaction, langOpt, error);
        return null; // Return null in case of an error
    }
}
module.exports = { getStatus, getMapDescription, sentErrorEmbed, sentVoteEmbed, hasUserVoted }
