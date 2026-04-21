const { EmbedBuilder } = require('discord.js');
const lang = require('../../data/lang/lang.json');
const { embedColor } = require('../../data/utilities/utilities.json');
const { fetchJson } = require('./http');
const { safeEdit, safeRespond } = require('./interactions');
const logger = require('./logger').child({ module: 'utilities' });

const DEFAULT_USER_DATA = {
    invisible: true,
    lang: 'en',
    embedColor,
};

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function normalizeUserData(userData = {}) {
    if (typeof userData === 'string') {
        return { ...DEFAULT_USER_DATA, lang: lang[userData] ? userData : DEFAULT_USER_DATA.lang };
    }

    return {
        ...DEFAULT_USER_DATA,
        ...userData,
        lang: lang[userData.lang] ? userData.lang : DEFAULT_USER_DATA.lang,
    };
}

function getFooter(interaction) {
    return {
        text: `${interaction.client.user.username} :heart:`,
        iconURL: interaction.client.user.displayAvatarURL(),
    };
}

function getLookupName(interaction) {
    return (
        interaction.options?.getString?.('username') ||
        interaction.options?.getString?.('player') ||
        'this player'
    );
}

async function sendLookUpError(interaction, userData) {
    const resolvedUserData = normalizeUserData(userData);
    const langOpt = resolvedUserData.lang;
    const lookUpError = new EmbedBuilder()
        .setTitle(`${lang[langOpt].error.line_3}`)
        .setDescription(`${lang[langOpt].error.line_4}\`\`${getLookupName(interaction)}\`\`.`)
        .setColor('D0342C')
        .setTimestamp();

    return safeEdit(interaction, { embeds: [lookUpError], ephemeral: resolvedUserData.invisible });
}

async function sendErrorEmbed(interaction, userData) {
    const resolvedUserData = normalizeUserData(userData);
    const langOpt = resolvedUserData.lang;
    const errorEmbed = new EmbedBuilder()
        .setDescription(
            `**${lang[langOpt].error.line_1}**\`\`\`${lang[langOpt].error.line_2}\`\`\``
        )
        .setFooter(getFooter(interaction))
        .setTimestamp()
        .setColor('Red');

    return safeEdit(interaction, { embeds: [errorEmbed], ephemeral: resolvedUserData.invisible });
}

async function sendVoteEmbed(interaction, userData) {
    const resolvedUserData = normalizeUserData(userData);
    const langOpt = resolvedUserData.lang;
    const voteEmbed = new EmbedBuilder()
        .setTitle(`${lang[langOpt].vote.line_1}`)
        .setDescription(
            `${lang[langOpt].vote.line_2}(https://discord.com/application-directory/1014207340188270673).` +
                `\n${lang[langOpt].vote.line_3}(https://top.gg/bot/1014207340188270673/vote).`
        )
        .setFooter(getFooter(interaction))
        .setTimestamp()
        .setColor('Red');

    return safeRespond(interaction, { embeds: [voteEmbed], ephemeral: resolvedUserData.invisible });
}

async function hasUserVoted(interaction) {
    if (!process.env.topgg_AUTH) {
        logger.warn('Skipping top.gg vote check because topgg_AUTH is missing', {
            userId: interaction.user.id,
        });
        return false;
    }

    const url = `https://top.gg/api/bots/1014207340188270673/check?userId=${interaction.user.id}`;

    try {
        const data = await fetchJson(url, {
            cacheKey: `topgg:voted:${interaction.user.id}`,
            cacheTtlMs: 5 * 60 * 1000,
            headers: { Authorization: process.env.topgg_AUTH },
            label: 'top.gg vote check',
            timeoutMs: 7000,
        });
        return data.voted === 1;
    } catch (error) {
        logger.warn('Top.gg vote check failed', { error, userId: interaction.user.id });
        return false;
    }
}

async function handleError(interaction, userData, statusOrError) {
    const status = typeof statusOrError === 'number' ? statusOrError : statusOrError?.status;
    const error =
        statusOrError instanceof Error
            ? statusOrError
            : new Error(`External API failed with HTTP ${status || 'unknown'}`);
    if (status) error.status = status;

    if (status === 404) {
        await sendLookUpError(interaction, userData);
    } else {
        await sendErrorEmbed(interaction, userData);
    }

    error.userNotified = true;
    throw error;
}

async function handleCommandError(interaction, userData, error) {
    logger.error('Command failed', {
        command: interaction.commandName,
        error,
        guildId: interaction.guild?.id,
        interactionId: interaction.id,
        userId: interaction.user?.id,
    });

    if (error?.userNotified) return null;
    if (error?.status === 404) return sendLookUpError(interaction, userData);
    return sendErrorEmbed(interaction, userData);
}

function checkData(data, interaction, userData) {
    if (!data || !data?.global || !data?.global?.name || data?.global?.name === '') {
        const error = new Error('Player lookup returned no usable data.');
        error.status = 404;
        sendLookUpError(interaction, userData).catch(sendError => {
            logger.warn('Failed to send lookup error', {
                error: sendError,
                interactionId: interaction.id,
            });
        });
        error.userNotified = true;
        throw error;
    }

    return data;
}

module.exports = {
    checkData,
    getFooter,
    handleCommandError,
    handleError,
    hasUserVoted,
    normalizeUserData,
    sendErrorEmbed,
    sendLookUpError,
    sendVoteEmbed,
    sleep,
};
