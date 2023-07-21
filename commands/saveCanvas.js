const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('save_canvas')
		.setDescription('Save the canvas to a SVG file'),
	async execute(interaction, manager) {
        manager.canvasManager.save();
		interaction.reply("Canvas saved!");
	},
};