const { createCanvas, loadImage } = require('canvas')
const fs = require('node:fs');

module.exports = {
    CanvasManager: function(){
        this.canvas = createCanvas(200, 200);
        this.ctx = this.canvas.getContext('2d');
        this.save = function() {
            fs.writeFileSync('out.svg', this.canvas.toBuffer())
        }
    }
}