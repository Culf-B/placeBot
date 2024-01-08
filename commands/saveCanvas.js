const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('save_canvas')
		.setDescription('Save the canvas (This command can only be used by user culf who created this bot)')
		.setDefaultMemberPermissions(0),
	async execute(interaction, manager) {
		if (interaction.user.id == '506113391665086484') {
			manager.canvasManager.save();
			interaction.reply({ content: "Canvas saved!", ephemeral: true });
		} else {
			interaction.reply({ content: "Only my creator has permission to use that command!", ephemeral: true });
		}
	},
};