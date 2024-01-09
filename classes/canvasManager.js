const { createCanvas, loadImage } = require('canvas');
const { width, height, gsMultiplier } = require('../data/canvasProperties.json');
const fs = require('node:fs');
const gWidth = (width + 1) * gsMultiplier;
const gHeight = (height + 1) * gsMultiplier;
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const logger = require('../tools/logger.js');

module.exports = {
    CanvasManager: function(client) {
        this.client = client;
        this.embed;
        this.messageFileAttachments;
        this.messageObjects;
        this.messageUpdateTime = 5 // minutes
        this.canvasChanged = false;
        this.messagesUpdatedByInterval;

        this.logger = new logger.Logger('CanvasManager');

        this.canvas = createCanvas(width, height);
        this.ctx = this.canvas.getContext('2d');
        
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;

        this.guidelineTemplateCanvas = createCanvas(gWidth, gHeight);
        this.gtCtx = this.guidelineTemplateCanvas.getContext('2d');

        this.guidelineCanvas = createCanvas(gWidth, gHeight)
        this.gCtx = this.guidelineCanvas.getContext('2d');

        this.gCtx.webkitImageSmoothingEnabled = false;
        this.gCtx.mozImageSmoothingEnabled = false;
        this.gCtx.imageSmoothingEnabled = false;

        this.changesMade = false;
        this.updateWhenChanged = true;

        this.load = function() {
            loadImage('./data/canvas.png').then((image) => {
                this.ctx.drawImage(image, 0, 0, width, height);

                loadImage('./data/guidelineCanvas.png').then((image) => {
                    this.gtCtx.drawImage(image, 0, 0, gWidth, gHeight);

                    this.updateGuidelineCanvas();

                    this.log("Canvas loaded");

                    this.updateAttachments();
                    this.embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('Discord Place')
                        .setDescription('Will update in ???')
                        .setImage('attachment://canvas.png')
                        .setTimestamp();
    
                    this.log("Embed loaded");
                });
            });
        }

        this.loadMessages = async function(serverData) {
            this.messageObjects = {};
            for (var serverId in serverData) {
                this.currentChannel = await this.client.channels.fetch(serverData[serverId][0])
                this.currentMessage = await this.currentChannel.messages.fetch(serverData[serverId][1])
                this.messageObjects[serverId] = this.currentMessage;
            }
        }
        this.updateMessages = async function() {
            this.updateAttachments();
            for (var key in this.messageObjects) {
                if (this.changesMade) {
                    this.changesMade = false;
                    this.updateTimestamp = Math.round(this.messagesUpdatedByInterval + this.messageUpdateTime * 60);
                    this.embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('Discord Place')
                        .setDescription(`Will update <t:${this.updateTimestamp}:R>`)
                        .setImage('attachment://canvas.png')
                        .setTimestamp();
                    this.messageObjects[key].edit({ embeds: [this.embed], files: [this.messageFileAttachments]});
                } else {
                    this.embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('Discord Place')
                        .setDescription(`No changes made! Will update when you draw something new \\:D`)
                        .setImage('attachment://canvas.png')
                        .setTimestamp();
                    this.messageObjects[key].edit({ embeds: [this.embed]});
                    this.updateWhenChanged = true;
                }

            }
            this.log("Messages updated")
        }
        this.save = function() {
            fs.writeFileSync('./data/canvas.png', this.canvas.toBuffer('image/png'));
            fs.writeFileSync('./data/test.png', this.guidelineCanvas.toBuffer('image/png'));
            this.log("Canvas saved")
        }

        this.updateGuidelineCanvas = function() {
            this.gCtx.fillStyle = 'white';
            this.gCtx.fillRect(0, 0, gWidth, gHeight);
            this.ctx.save();
            this.ctx.scale(gsMultiplier, gsMultiplier);
            this.gCtx.drawImage(this.canvas, gsMultiplier, gsMultiplier, gWidth - gsMultiplier, gHeight - gsMultiplier);
            this.ctx.restore();
            this.gCtx.drawImage(this.guidelineTemplateCanvas, 0, 0, gWidth, gHeight);
        }
        
        this.updateAttachments = function() {
            this.updateGuidelineCanvas();
            this.messageFileAttachments = new AttachmentBuilder(this.guidelineCanvas.toBuffer('image/png'), {'name': 'canvas.png'});
        }
        
        this.draw = function(x, y, color) {
            this.colors = {
                red: '#ff4500',
                orange: '#ffa800',
                yellow: '#ffd635',
                dark_green: '#00a368',
                light_green: '#7eed56',
                dark_blue: '#2450a4',
                blue: '#3690ea',
                light_blue: '#51e9f4',
                dark_purple: '#811e9f',
                purple: '#b44ac0',
                light_pink: '#ff99aa',
                brown: '#9c6926',
                black: '#000000',
                gray: '#898d90',
                white: '#ffffff',
            }
            this.ctx.fillStyle = this.colors[color];
            this.ctx.fillRect(x, y, 1, 1);
            this.updateGuidelineCanvas();

            this.changesMade = true;

            // Update immediately if one or more updates has happened without changes
            if (this.updateWhenChanged) {
                this.updateWhenChanged = false;
                this.updateMessages();
            }

        }
        this.setup = async function(serverData, serverId, channelId) {
            this.currentSetupChannel = await this.client.channels.fetch(channelId);
            this.currentSetupMessage = await this.currentSetupChannel.send({embeds:  [this.embed], files: [this.messageFileAttachments] });
            serverData[serverId][1] = this.currentSetupMessage.id;
        }
        this.log = function(message) {
            this.logger.log(message);
        }
    }
}