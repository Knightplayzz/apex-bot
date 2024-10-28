const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require('canvas');
const array = require("../../../data/legends/misc/banners.json");
///from https://www.ea.com/games/apex-legends/about/characters

module.exports = {
    data: new SlashCommandBuilder()
        .setName('team')
        .setDescription('Pick a random team to play in-game.'),

    async execute(interaction, auth, userData) {

        await interaction.deferReply({ ephemeral: userData.invisible });

        const canvas = Canvas.createCanvas(1300, 500);
        const ctx = canvas.getContext('2d');

        var y = array.length;
        var uniqueNumbers = [];

        while (uniqueNumbers.length < 3) {
            var randomNumber = Math.floor(Math.random() * y);
            if (!uniqueNumbers.includes(randomNumber)) {
                uniqueNumbers.push(randomNumber);
            }
        }

        const player1 = await Canvas.loadImage(array[uniqueNumbers[0]].url);
        const player2 = await Canvas.loadImage(array[uniqueNumbers[1]].url);
        const player3 = await Canvas.loadImage(array[uniqueNumbers[2]].url);

        //if image is outdated the thing wont crash
        if (player1) ctx.drawImage(player1, -100, -100);
        if (player2) ctx.drawImage(player2, 330, -100);
        if (player3) ctx.drawImage(player3, 760, -100);

        //if image is outdated log it
        if (!player1 || !player2 || !player3) console.log(`${array[uniqueNumbers[0]]}, ${array[uniqueNumbers[1]]}, ${array[uniqueNumbers[2]]}`);

        var attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'team.png' });
        var teamEmbed = new EmbedBuilder()
            .setTitle('Team')
            .setColor(userData.embedColor)
            .setFooter({ text: `${interaction.client.user.username} ❤️`, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()
            .setImage(`attachment://${attachment.name}`);

        return interaction.editReply({ embeds: [teamEmbed], files: [attachment], ephemeral: userData.invisible });
    }
}