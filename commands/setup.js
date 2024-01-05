const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set_channel')
		.setDescription('Choose which channel the bot will use.')
		.setDefaultMemberPermissions(0)
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel to use.')
				.setRequired(true)
				// Ensure the user can only select a TextChannel for output
				.addChannelTypes(ChannelType.GuildText)
		),
	async execute(interaction, manager) {
		serverId = interaction.options.getChannel('channel').guild.id;
		channelId = interaction.options.getChannel('channel').id;
		
		try {
			manager.serverManager.updateServerChannel(serverId, channelId);
			interaction.reply({ content: "Channel set to \"" + interaction.options.getChannel('channel').name + "\"", ephemeral: true });
		} catch (error) {
			console.log("Error when updating channel for server with ID: " + serverId + " to channel with ID: " + channelId + "\n" + error);
			interaction.reply({ content: "An error occurred!", ephemeral: true });
		}
	},
};