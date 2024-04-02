const Jimp = require("jimp");
const fs = require('node:fs');
const { width, height, gsMultiplier } = require('./data/canvasProperties.json');

canvas = new Jimp(width, height, 0xFFFFFFFF);

canvas.getBuffer('image/png', (err, buffer) => {
    fs.writeFileSync('./data/canvas.png', buffer);
})

canvas = new Jimp((width + 1) * gsMultiplier, (height + 1) * gsMultiplier);

color = 0x000000ff;

Jimp.loadFont(Jimp.FONT_SANS_10_BLACK).then((font) => {
    // Vertical
    for (i = 0; i < width + 1; i++) {
        // Lines
        for (j = 0; j < (height + 1) * gsMultiplier; j++) {
            canvas.setPixelColor(color, i * gsMultiplier, j);
        }

        // Text
        if (i > 0) {
            canvas.print(font, i * gsMultiplier + gsMultiplier/10, 0, i - 1);
        }
    }

    // Horisontal
    for (i = 0; i < height + 1; i++) {
        // Lines
        for (j = 0; j < (width + 1) * gsMultiplier; j++) {
            canvas.setPixelColor(color, j, i * gsMultiplier);
        }

        // Text
        if (i > 0) {
            canvas.print(font, gsMultiplier/8, i * gsMultiplier, i - 1);
        }
    }

    // Save
    canvas.getBuffer('image/png', (err, buffer) => {
        fs.writeFileSync('./data/guidelineCanvas.png', buffer);
    })
});