const { createCanvas, loadImage } = require('canvas');
const fs = require('node:fs');
const { width, height, gsMultiplier } = require('./data/canvasProperties.json')

// Create blank canvas
canvas = createCanvas(width, height);
ctx = canvas.getContext('2d');

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, width, height); 

fs.writeFileSync('./data/canvas.png', canvas.toBuffer("image/png"));

// Create Blank guideline canvas
canvas = createCanvas((width + 1) * gsMultiplier, (height + 1) * gsMultiplier);
ctx = canvas.getContext('2d');

ctx.strokeStyle = 'black';
ctx.fillStyle = 'black';
ctx.lineWidth = 1;
ctx.font = "10px serif";

for (i = 0; i < width + 1; i++) {
    ctx.moveTo(i * gsMultiplier, 0);
    ctx.lineTo(i * gsMultiplier, (height + 1) * gsMultiplier);
    if (i > 0) {
        ctx.fillText(i - 1, i * gsMultiplier + gsMultiplier/10, gsMultiplier * 0.9);
    }
}
for (i = 0; i < height + 1; i++) {
    ctx.moveTo(0, i * gsMultiplier);
    ctx.lineTo((width + 1) * gsMultiplier, i * gsMultiplier);
    if (i > 0) {
        ctx.fillText(i - 1, gsMultiplier/10, (i + 0.9) * gsMultiplier);
    }
}
ctx.stroke();

fs.writeFileSync('./data/guidelineCanvas.png', canvas.toBuffer("image/png"));