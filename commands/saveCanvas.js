const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('save_canvas')
		.setDescription('Save the canvas')
		.setDefaultMemberPermissions(0),
	async execute(interaction, manager) {
        manager.canvasManager.save();
		interaction.reply({ content: "Canvas saved!", ephemeral: true });
	},
};