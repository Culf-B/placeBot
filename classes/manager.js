const CanvasManager = require('./canvasManager.js');
const ServerManager = require('./serverManager.js');

module.exports = {
    Manager: function(){
        this.canvasManager = new CanvasManager.CanvasManager();
        this.canvasManager.load();

        this.serverManager = new ServerManager.ServerManager();
        this.serverManager.load();
    }
}