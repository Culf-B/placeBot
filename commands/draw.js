const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	cooldown: 60 * 5,
	data: new SlashCommandBuilder()
		.setName('draw')
		.setDescription('Draw a pixel on the canvas')
		.addIntegerOption(option =>
			option.setName('x')
			.setDescription('X coordinate')
			.setRequired(true)
			.setMaxValue(49)
			.setMinValue(0)
		)
		.addIntegerOption(option =>
			option.setName('y')
			.setDescription('Y coordinate')
			.setRequired(true)
			.setMaxValue(49)
			.setMinValue(0)
		)
		.addStringOption(option =>
			option.setName('color')
			.setDescription('Choose a color to draw')
			.setRequired(true)
			.addChoices(
					{ name: 'Red', value: 'red' },
					{ name: 'Orange', value: 'orange' },
					{ name: 'Yellow', value: 'yellow' },
					{ name: 'Dark Green', value: 'dark_green' },
					{ name: 'Light Green', value: 'light_green' },
					{ name: 'Dark Blue', value: 'dark_blue' },
					{ name: 'Blue', value: 'blue' },
					{ name: 'Light Blue', value: 'light_blue' },
					{ name: 'Dark Purple', value: 'dark_purple' },
					{ name: 'Purple', value: 'purple' },
					{ name: 'Light Pink', value: 'light_pink' },
					{ name: 'Brown', value: 'brown' },
					{ name: 'Black', value: 'black' },
					{ name: 'Gray', value: 'gray' },
					{ name: 'White', value: 'white' }
				)
		),
	async execute(interaction, manager) {
		manager.canvasManager.draw(
			interaction.options.getInteger('x'),
			interaction.options.getInteger('y'),
			interaction.options.getString('color')
		);
		
        interaction.reply({ content: `Canvas updated! You can draw again <t:${Math.round(Date.now() / 1000 + 60 * 5)}:R>`, ephemeral: true })
	},
};