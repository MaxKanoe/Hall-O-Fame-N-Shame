const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Give instructions for the bot'),
	async execute(interaction) {
		await interaction.reply('¯\_(ツ)_/¯ lmao');
	},
};