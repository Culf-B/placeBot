const CanvasManager = require('./canvasManager.js');
const ServerManager = require('./serverManager.js');

module.exports = {
    Manager: function(client){
        this.canvasManager = new CanvasManager.CanvasManager(client);
        this.serverManager = new ServerManager.ServerManager();
        this.canvasManager.load();
        this.serverManager.load();
    }
}