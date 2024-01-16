const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const Manager = require('./classes/manager.js');
const loggerTool = require('./tools/logger.js');

// Init
const client = new Client({ intents: [] });
const manager = new Manager.Manager(client);
const logger = new loggerTool.Logger('Main');

// Load commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.cooldowns = new Collection();

// Bad stuff events
client.on('invalidated', () => {
    logger.log(`invalidated`, true);
});

client.on('invalidRequestWarning', (invalidRequestWarningData) => {
    logger.log(`invalidRequestWarning: ${invalidRequestWarningData}`, true);
});

client.on('warn', (info) => {
    logger.log(`warn: ${info}`, true);
});

// Client login
client.once('ready', () => {
	logger.log('Client is ready');
	manager.tokenRequiredLoading();
});

// Functionality event handling
client.on('interactionCreate', async interaction => {
	// Validate input
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;
	
	// Cooldown
	const { cooldowns } = client;

	if (!cooldowns.has(command.data.name)) {
		cooldowns.set(command.data.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.data.name);
	const defaultCooldownDuration = 3;
	const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

	if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

		if (now < expirationTime) {
			const expiredTimestamp = Math.round(expirationTime / 1000);
			return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
		}
	}

	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

	// Try catch for executing command
	try {
		await command.execute(interaction, manager);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Client login
client.login(token);