const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Use this command if you have trouble with the bot'),
	async execute(interaction, manager) {
        if (manager.serverManager.getServerData(interaction.guild.id) == undefined) {
            interaction.reply(
                {
                    content: "Please run /set_channel.\nIf you have already done this before, the bot has encountered an issue which requires you to run setup again.",
                    ephemeral: true
                }
            );
        } else {
            interaction.reply(
                {
                    content: "Everything is fine :thumbsup:",
                    ephemeral: true
                }
            );
        }
	},
};