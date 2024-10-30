const { EmbedBuilder } = require("discord.js");
const lang = require('../../data/lang/lang.json');
const fetch = require('node-fetch');
require('dotenv').config();

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function sendLookUpError(interaction, userData) {
    const langOpt = userData.lang;
    const lookUpError = new EmbedBuilder()
        .setTitle(`${lang[langOpt].error.line_3}`)
        .setDescription(`${lang[langOpt].error.line_4}` + "``" + `${interaction.options.getString('username')}` + "``.")
        .setColor('D0342C')
        .setTimestamp();

    interaction.editReply({ embeds: [lookUpError], ephemeral: userData.invisible });
}
function sendErrorEmbed(interaction, userData) {
    const langOpt = userData.lang;
    const errorEmbed = new EmbedBuilder()
        .setDescription(`**${lang[langOpt].error.line_1}**` +
            "```" + lang[langOpt].error.line_2 + "```")
        .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp()
        .setColor("Red");

    interaction.editReply({ embeds: [errorEmbed], ephemeral: userData.invisible });
}

function sendVoteEmbed(interaction, userData) {
    const langOpt = userData.lang;
    const voteEmbed = new EmbedBuilder()
        .setTitle(`${lang[langOpt].vote.line_1}`)
        .setDescription(`${lang[langOpt].vote.line_2}(https://discord.com/application-directory/1014207340188270673).` +
            `\n${lang[langOpt].vote.line_3}(https://top.gg/bot/1014207340188270673/vote).`)
        .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp()
        .setColor("Red");

    return interaction.reply({ embeds: [voteEmbed], ephemeral: userData.invisible });
}
async function hasUserVoted(interaction, userData) {
    const url = `https://top.gg/api/bots/1014207340188270673/check?userId=${interaction.user.id}`;
    try {
        const res = await fetch(url, { headers: { "Authorization": process.env.topgg_AUTH } });
        const data = await res.json();
        return data.voted === 1;
    } catch (error) {
        sendErrorEmbed(interaction, userData, error);
        return false; // Return false in case of an error
    }
}
function handleError(interaction, userData, status) {
    if (status === 400 || status === 429) sendErrorEmbed(interaction, userData); //try again later
    if (status === 403 || status === 410) sendErrorEmbed(interaction, userData); //my fault
    if (status === 404) sendLookUpError(interaction, userData); //lookup err
    if (status === 500 || status === 405) sendErrorEmbed(interaction, userData); //api error
    if (status !== 404) {
        console.log(`SOMETHING WENT WRONG ${status}`);
        return Promise.reject('Error occurred');
    }
}

function checkData(data, interaction, userData) {
    if (!data || !data?.global || !data?.global?.name || data?.global?.name === '') return sendLookUpError(interaction, userData);
}
module.exports = { sendErrorEmbed, sendVoteEmbed, hasUserVoted, handleError, sleep, sendLookUpError, checkData };