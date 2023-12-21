const CanvasManager = require('./canvasManager.js');

module.exports = {
    Manager: function(){
        this.canvasManager = new CanvasManager.CanvasManager();
        this.canvasManager.load();
    }
}