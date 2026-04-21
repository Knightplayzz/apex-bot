const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');
const legends = require('../../../data/legends/misc/banners.json');
const logger = require('../../../utilities/functions/logger').child({ module: 'teamCommand' });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('team')
        .setDescription('Pick a random team to play in-game.'),

    async execute(interaction, auth, userData) {
        await interaction.deferReply({ ephemeral: userData.invisible });

        const canvas = Canvas.createCanvas(1300, 500);
        const ctx = canvas.getContext('2d');
        const uniqueNumbers = pickUniqueIndexes(legends.length, 3);
        const images = await Promise.all(uniqueNumbers.map(index => loadLegendImage(index)));

        const positions = [-100, 330, 760];
        images.forEach((image, index) => {
            if (image) ctx.drawImage(image, positions[index], -100);
        });

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'team.png' });
        const teamEmbed = new EmbedBuilder()
            .setTitle('Team')
            .setColor(userData.embedColor)
            .setFooter({
                text: `${interaction.client.user.username} :heart:`,
                iconURL: interaction.client.user.displayAvatarURL(),
            })
            .setTimestamp()
            .setImage(`attachment://${attachment.name}`);

        return interaction.editReply({
            embeds: [teamEmbed],
            files: [attachment],
            ephemeral: userData.invisible,
        });
    },
};

function pickUniqueIndexes(max, count) {
    const indexes = new Set();
    while (indexes.size < count) {
        indexes.add(Math.floor(Math.random() * max));
    }
    return [...indexes];
}

async function loadLegendImage(index) {
    try {
        return await Canvas.loadImage(legends[index].url);
    } catch (error) {
        logger.warn('Failed to load legend banner', {
            error,
            legend: legends[index]?.name,
            url: legends[index]?.url,
        });
        return null;
    }
}
