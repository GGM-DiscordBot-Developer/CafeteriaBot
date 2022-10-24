const { EmbedBuilder, TextBasedChannel } = require("discord.js");

const handlers = {};

const helpEmbedData = require('./helpEmbed.json');
const helpEmbed = new EmbedBuilder()
.setTitle(helpEmbedData.title)
.setColor(helpEmbedData.color)
.setFields(helpEmbedData.fields)
.setFooter(helpEmbedData.footer)
.setImage(helpEmbedData.image);

handlers["도움"] = {
    /**
     * @param {string[]} args
     * @param {TextBasedChannel} channel
     * @param {number} time
     */
    handle(args, channel, time) {
        channel.send({embeds : [helpEmbed]});
    }
}

handlers["오늘"] = {
    /**
     * @param {string[]} args 
     * @param {TextBasedChannel} channel 
     * @param {number} time 
     */
    handle(args, channel, time) {
        console.log(time);
    }
}

module.exports = handlers;