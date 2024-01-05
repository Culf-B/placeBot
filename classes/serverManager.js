const fs = require('node:fs');

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

        this.updateServerChannel = function(serverId, channelId) {
            // Make sure the channel has been changed
            if (this.servers[serverId] != channelId) {
                // Update data
                this.servers[serverId] = channelId;
                // Save
                this.save();
            }
        }
    }
}