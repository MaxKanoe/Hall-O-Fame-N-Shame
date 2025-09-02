const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fame')
		.setDescription('Adds a message or a group of messages to the Hall of Fame channel'),
	async execute(interaction) {
		await interaction.reply(`¯\_(ツ)_/¯ lmao`);
	},
};