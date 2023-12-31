const fs = require('node:fs');
const canvasManager = require('./canvasManager');

module.exports = {
    ServerManager: function() {
        this.servers = {};

        this.load = function() {
            this.servers = JSON.parse(fs.readFileSync('./data/serverdata.json',
            { encoding: 'utf8', flag: 'r' }));
        }

        this.save = function() {
            fs.writeFileSync('./data/serverdata.json', JSON.stringify(this.servers));
        }

        this.updateServerChannel = function(canvasManager, serverId, channelId) {
            // If this server has never been setup before, setup data structure first
            if (this.servers[serverId] != undefined) {
                // Make sure the channel has been changed
                if (this.servers[serverId][0] != channelId) {
                    // Update data
                    this.servers[serverId][0] = channelId;
                    // Setup channel image message with canvasManager
                    canvasManager.setup(this.servers, serverId, channelId);
                    // Save
                    this.save();
                }
            } else {
                this.servers[serverId] = [channelId, undefined];
                // Setup channel image message with canvasManager
                canvasManager.setup(serverId, channelId);
                // Save
                this.save();
            }
        }
    }
}