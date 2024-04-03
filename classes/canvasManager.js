const Jimp = require("jimp");
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
        this.messageUpdateTime = 5; // minutes
        this.messagesUpdatedByInterval;

        this.logger = new logger.Logger('CanvasManager');

        this.canvas = new Jimp(width, height);

        this.guidelineTemplateCanvas = new Jimp(gWidth, gHeight);

        this.guidelineCanvas = new Jimp(gWidth, gHeight);

        this.changesMade = false;
        this.updateWhenChanged = true;

        this.load = function() {
            Jimp.read('./data/canvas.png')
                .then((image) => {
                
                    this.canvas.blit(image, 0, 0);

                    Jimp.read('./data/guidelineCanvas.png')
                        .then((image) => {
                            this.guidelineTemplateCanvas.blit(image, 0, 0);

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
        this.getMessage = async function(serverId, channelId, messageId, clientServerList) {
            /*
            Get a message
            Will return with message object if the message validation succeeded
            Will return with undefined if message validation failed
            */

            // Validate server
            if (clientServerList.has(serverId)) {

                // Get info from server
                this.currentServer = await client.guilds.fetch(serverId);
                this.currentChannelList = await this.currentServer.channels.fetch();

                // Validate channel
                if (this.currentChannelList.has(channelId)) {

                    // Get info from channel
                    try { // Validate message
                        this.currentChannel = await this.client.channels.fetch(channelId);
                        this.currentMessage = await this.currentChannel.messages.fetch(messageId);
                        return this.currentMessage;

                    } catch(error) { // Invalid message
                        this.log("Message is invalid! Message ID: " + messageId + "\n" + error, true);
                    }
                    
                } else { // Invalid channel
                    this.log("Channel is invalid! Channel ID: " + channelId, true);
                }

            } else { // Invalid server
                this.log("Server is invalid! Server ID: " + serverId, true);
            }
            return undefined;
        }

        this.loadMessages = async function(serverData) {
            this.messageObjects = {};
            this.tempInvalidServers = [];
            this.clientServerList = await this.client.guilds.fetch();

            for (var serverId in serverData) {

                // Get message from server
                this.currentMessage = await this.getMessage(serverId, serverData[serverId][0], serverData[serverId][1], this.clientServerList);

                // Check if message was valid
                if (this.currentMessage != undefined) {
                    // Save loaded message data
                    this.messageObjects[serverId] = this.currentMessage;
                } else {
                    // Delete data from server so that the server needs to be setup again
                    this.tempInvalidServers.push(serverId);
                }
            }
            return this.tempInvalidServers;
        }
        this.updateMessages = async function() {
            await this.updateAttachments();
            for (var key in this.messageObjects) {
                if (this.changesMade) { // Update message
                    this.updateTimestamp = Math.round(this.messagesUpdatedByInterval + this.messageUpdateTime * 60);
                    this.embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('Discord Place')
                        .setDescription(`Will update <t:${this.updateTimestamp}:R>`)
                        .setImage('attachment://canvas.png')
                        .setTimestamp();
                    try {
                        this.messageObjects[key].edit({ embeds: [this.embed], files: [this.messageFileAttachments]});
                    } catch(error) {
                        this.log(error, true);
                    }
                } else { // Update canvas description to no changes made description
                    this.embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('Discord Place')
                        .setDescription(`No changes made! Will update when you draw something new \\:D`)
                        .setImage('attachment://canvas.png')
                        .setTimestamp();
                    try {
                        this.messageObjects[key].edit({ embeds: [this.embed]});
                    } catch(error) {
                        this.log(error, true);
                    }
                    this.updateWhenChanged = true;
                }
            }
            this.changesMade = false;
            this.log("Messages updated");
        }
        this.save = function() {
            this.canvas.getBuffer('image/png', (err, buffer) => {
                fs.writeFileSync('./data/canvas.png', buffer);
                this.log("Canvas saved");
            });
            this.guidelineCanvas.getBuffer('image/png', (err, buffer) => {
                fs.writeFileSync('./data/test.png', buffer);
                this.log("Guideline canvas saved");
            });
        }

        this.updateGuidelineCanvas = async function() {
            this.guidelineCanvas = await new Jimp(gWidth, gHeight, 0xffffffff);
            this.canvasResize = await this.canvas.clone();
            await this.canvasResize.resize(width * gsMultiplier, width * gsMultiplier, Jimp.RESIZE_NEAREST_NEIGHBOR);
            await this.guidelineCanvas.blit(this.canvasResize, gsMultiplier, gsMultiplier);
            await this.guidelineCanvas.blit(this.guidelineTemplateCanvas, 0, 0);
        }
        
        this.updateAttachments = async function() {
            await this.updateGuidelineCanvas();
            this.guidelineCanvas.getBuffer('image/png', (err, buffer) => {
                this.messageFileAttachments = new AttachmentBuilder(buffer, {'name': 'canvas.png'});
            });
        }
        
        this.draw = async function(x, y, color) {
            this.colors = {
                red: 0xff4500ff,
                orange: 0xffa800ff,
                yellow: 0xffd635ff,
                dark_green: 0x00a368ff,
                light_green: 0x7eed56ff,
                dark_blue: 0x2450a4ff,
                blue: 0x3690eaff,
                light_blue: 0x51e9f4ff,
                dark_purple: 0x811e9fff,
                purple: 0xb44ac0ff,
                light_pink: 0xff99aaff,
                brown: 0x9c6926ff,
                black: 0x000000ff,
                gray: 0x898d90ff,
                white: 0xffffffff
            }

            await this.canvas.setPixelColor(this.colors[color], x, y);
            await this.updateGuidelineCanvas();

            this.changesMade = true;
            // Update immediately if one or more updates has happened without changes
            if (this.updateWhenChanged) {
                this.updateWhenChanged = false;
                await this.save();
                await this.updateMessages();
            }
        }

        this.setup = async function(serverData, serverId, channelId) {
            this.currentSetupChannel = await this.client.channels.fetch(channelId);
            this.currentSetupMessage = await this.currentSetupChannel.send({embeds:  [this.embed], files: [this.messageFileAttachments] });
            serverData[serverId][1] = this.currentSetupMessage.id;
            // Load the new message into the currently loaded message objects so that it will be updated with the other messages
            this.messageObjects[serverId] = this.currentSetupMessage;
        }
        this.log = function(message, error=false) {
            this.logger.log(message, error);
        }
    }
}