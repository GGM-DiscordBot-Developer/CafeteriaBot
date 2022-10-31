const { EmbedBuilder, TextBasedChannel } = require("discord.js");

const getLunch = require('./getLunch.js');

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
     */
    handle(args, channel) {
        channel.send({embeds : [helpEmbed]});
    }
}

handlers["점심"] = handlers["오늘"] = {
    /**
     * @param {string[]} args 
     * @param {TextBasedChannel} channel 
     */
    handle(args, channel) {
        let date = new Date();
        getLunch(date, (arr) => {
            channel.send({embeds: [
                new EmbedBuilder()
                .setTitle(":fork_and_knife:   __**겜마고 급식 정보**__")
                .addFields([{
                    name: `:spoon: ${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 급식`,
                    value: arr.join("\n") + '\n\n"!급식 도움"을 입력하여 더 많은 명령어를 확인하세요.'
                }])
                .setImage(helpEmbedData.image)
                .setFooter(helpEmbedData.footer)
                .setColor('#00ff00')
            ]});
        });
    }
}

handlers["내일"] = {
    /**
     * @param {string[]} args 
     * @param {TextBasedChannel} channel 
     */
    handle(args, channel) {
        let date = new Date();
        date.setDate(date.getDate() + 1);
        getLunch(date, (arr) => {
            channel.send({embeds: [
                new EmbedBuilder()
                .setTitle(":fork_and_knife:   __**겜마고 급식 정보**__")
                .addFields([{
                    name: `:spoon: ${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 급식`,
                    value: arr.join("\n") + '\n\n"!급식 도움"을 입력하여 더 많은 명령어를 확인하세요.'
                }])
                .setImage(helpEmbedData.image)
                .setFooter(helpEmbedData.footer)
                .setColor('#00ff00')
            ]});
        });
    }
}

module.exports = handlers;