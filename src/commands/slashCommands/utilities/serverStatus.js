const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require('node-fetch');
const emoji = require('../../../data/utilities/emoji.json');
const { handleError } = require('../../../utilities/functions/utilities');

module.exports = {
    premium: true,
    data: new SlashCommandBuilder()
        .setName('status')
        .setDMPermission(true)
        .setDescription('Shows current in-game server status.')
        .setDescriptionLocalizations({ nl: 'Toont huidige in-game server status.' }),

    async execute(interaction, auth, userData) {

        await interaction.deferReply({ ephemeral: userData.invisible });

        var url = encodeURI(`https://api.mozambiquehe.re/servers?auth=${auth}`);
        fetch(url)
            .then(res => {
                if (res.status === 200) { return res.json() } else {
                    handleError(interaction, userData, res.status);
                    return Promise.reject('Error occurred');
                }
            })
            .then(data => {
                let colorArray = [];
                const type = ["ApexOauth_Crossplay", "Origin_login", "EA_accounts", "EA_novafusion"];
                const type2 = ["US-East", "US-Central", "US-West", "EU-East", "EU-West", "SouthAmerica", "Asia"];

                for (let i = 0; i < 4; i++) {
                    for (let y = 0; y < 7; y++) {
                        if (data[type[i]][type2[y]].Status === "UP") {
                            colorArray.push(`${emoji.misc.Green} `);
                        }
                        if (data[type[i]][type2[y]].Status === "SLOW") {
                            colorArray.push(`${emoji.misc.Orange} `);
                        }
                        if (data[type[i]][type2[y]].Status === "DOWN") {
                            colorArray.push(`${emoji.misc.Red} `);
                        }
                    }
                }
                var serverStatusEmbed = new EmbedBuilder()
                    .setTitle(`Apex Legends Server Status`)
                    .addFields([
                        {
                            name: '[Crossplay] Apex Login',
                            value:
                                `${colorArray[0]} **US East:** ${data.ApexOauth_Crossplay["US-East"].ResponseTime}ms` +
                                `\n${colorArray[1]} **US Central:** ${data.ApexOauth_Crossplay["US-Central"].ResponseTime}ms` +
                                `\n${colorArray[2]} **US West:** ${data.ApexOauth_Crossplay["US-West"].ResponseTime}ms` +
                                `\n${colorArray[3]} **EU East:** ${data.ApexOauth_Crossplay["EU-East"].ResponseTime}ms` +
                                `\n${colorArray[4]} **EU West:** ${data.ApexOauth_Crossplay["EU-West"].ResponseTime}ms` +
                                `\n${colorArray[5]} **South America:** ${data.ApexOauth_Crossplay["SouthAmerica"].ResponseTime}ms` +
                                `\n${colorArray[6]} **Asia:** ${data.ApexOauth_Crossplay["Asia"].ResponseTime}ms`,
                            inline: true,
                        },
                        {
                            name: '\u200B',
                            value: '\u200B',
                            inline: true,
                        },
                        {
                            name: 'Origin Login',
                            value:
                                `${colorArray[7]} **US East:** ${data.Origin_login["US-East"].ResponseTime}ms` +
                                `\n${colorArray[8]} **US Central:** ${data.Origin_login["US-Central"].ResponseTime}ms` +
                                `\n${colorArray[9]} **US West:** ${data.Origin_login["US-West"].ResponseTime}ms` +
                                `\n${colorArray[10]} **EU East:** ${data.Origin_login["EU-East"].ResponseTime}ms` +
                                `\n${colorArray[11]} **EU West:** ${data.Origin_login["EU-West"].ResponseTime}ms` +
                                `\n${colorArray[12]} **South America:** ${data.Origin_login["SouthAmerica"].ResponseTime}ms` +
                                `\n${colorArray[13]} **Asia:** ${data.Origin_login["Asia"].ResponseTime}ms`,
                            inline: true,
                        },
                        {
                            name: 'EA Accounts',
                            value:
                                `${colorArray[14]} **US East:** ${data.EA_accounts["US-East"].ResponseTime}ms` +
                                `\n${colorArray[15]} **US Central:** ${data.EA_accounts["US-Central"].ResponseTime}ms` +
                                `\n${colorArray[16]} **US West:** ${data.EA_accounts["US-West"].ResponseTime}ms` +
                                `\n${colorArray[17]} **EU East:** ${data.EA_accounts["EU-East"].ResponseTime}ms` +
                                `\n${colorArray[18]} **EU West:** ${data.EA_accounts["EU-West"].ResponseTime}ms` +
                                `\n${colorArray[19]} **South America:** ${data.EA_accounts["SouthAmerica"].ResponseTime}ms` +
                                `\n${colorArray[20]} **Asia:** ${data.EA_accounts["Asia"].ResponseTime}ms`,
                            inline: true,
                        },
                        {
                            name: '\u200B',
                            value: '\u200B',
                            inline: true,
                        },
                        {
                            name: 'Lobby & MatchMaking Services',
                            value:
                                `${colorArray[21]} **US East:** ${data.EA_novafusion["US-East"].ResponseTime}ms` +
                                `\n${colorArray[22]} **US Central:** ${data.EA_novafusion["US-Central"].ResponseTime}ms` +
                                `\n${colorArray[23]} **US West:** ${data.EA_novafusion["US-West"].ResponseTime}ms` +
                                `\n${colorArray[24]} **EU East:** ${data.EA_novafusion["EU-East"].ResponseTime}ms` +
                                `\n${colorArray[25]} **EU West:** ${data.EA_novafusion["EU-West"].ResponseTime}ms` +
                                `\n${colorArray[26]} **South America:** ${data.EA_novafusion["SouthAmerica"].ResponseTime}ms` +
                                `\n${colorArray[27]} **Asia:** ${data.EA_novafusion["Asia"].ResponseTime}ms`,
                            inline: true,
                        },
                    ])
                    .setFooter({ text: "Status data provided by https://apexlegendsstatus.com/", iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp();


                let x1 = colorArray.filter(str => str === ':yellow_circle: ').length;
                let x2 = colorArray.filter(str => str === ':red_circle: ').length;

                if (x2 > 4) serverStatusEmbed.setColor('Red');
                if (x1 > 4 && x2 <= 4) serverStatusEmbed.setColor('Yellow');
                if (x1 <= 4 && x2 <= 4) serverStatusEmbed.setColor('Green');

                interaction.editReply({ embeds: [serverStatusEmbed], ephemeral: userData.invisible });

            }).catch(error => { console.error('Fetch error:', error) })
    }
}
