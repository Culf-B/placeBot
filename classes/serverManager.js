const fs = require('node:fs');
const logger = require('../tools/logger.js');

module.exports = {
    ServerManager: function() {
        this.servers = {};
        this.logger = new logger.Logger('ServerManager');

        this.load = function() {
            this.servers = JSON.parse(fs.readFileSync('./data/serverdata.json',
            { encoding: 'utf8', flag: 'r' }));
            this.log("Servers loaded");
        }

        this.save = function() {
            fs.writeFileSync('./data/serverdata.json', JSON.stringify(this.servers));
            this.log("Saved serverdata");
        }

        this.deleteServerData = function(serverId) {
            delete this.servers[serverId];
            this.log("Deleted serverdata for server with ID: " + serverId);
            this.save();
        }

        this.updateServerChannel = async function(canvasManager, serverId, channelId) {
            // If this server has never been setup before, setup data structure first
            if (this.servers[serverId] != undefined) {
                // Make sure the channel has been changed
                if (this.servers[serverId][0] != channelId) {
                    // Update data
                    this.servers[serverId][0] = channelId;
                    // Setup channel image message with canvasManager
                    await canvasManager.setup(this.servers, serverId, channelId);
                    // Save
                    this.save();
                }
            } else {
                this.servers[serverId] = [channelId, undefined];
                // Setup channel image message with canvasManager
                await canvasManager.setup(this.servers, serverId, channelId);
                // Save
                this.save();
            }
        }
        this.log = function(message) {
            this.logger.log(message);
        }
    }
}