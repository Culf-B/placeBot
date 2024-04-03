const CanvasManager = require('./canvasManager.js');
const serverManager = require('./serverManager.js');
const ServerManager = require('./serverManager.js');

module.exports = {
    Manager: function(client){
        this.serverManager = new ServerManager.ServerManager();
        this.canvasManager = new CanvasManager.CanvasManager(client, this.serverManager);
        this.canvasManager.load();
        this.serverManager.load(); 

        this.tokenRequiredLoading = async function() {
            // Load messages
            this.canvasManager.log("Loading messages...");
            this.tempInvalidServers = await this.canvasManager.loadMessages(this.serverManager.servers);
            this.tempInvalidServers.forEach(serverId => {
                this.serverManager.deleteServerData(serverId);
            });
            this.canvasManager.log("Messages loaded");
            // Update messages
            this.canvasManager.messagesUpdatedByInterval = Math.round(Date.now() / 1000)
            this.canvasManager.updateMessages();
            // Message update interval
            setInterval(() => {
                    // Autosave canvas if changes has been made
                    if (this.canvasManager.changesMade) {
                        this.canvasManager.save();
                    }
                    // Update messages
                    this.canvasManager.messagesUpdatedByInterval = Math.round(Date.now() / 1000)
                    this.canvasManager.updateMessages()
                },
                this.canvasManager.messageUpdateTime * 1000 * 60 // Convert from milliseconds to minutes
            );
        }
    }
}