const { EmbedBuilder, TextBasedChannel, Message } = require("discord.js");
const request = require("request");
const { excelParser, readExcelFile } = require("./excelReader.js");
const excelToJson = require("convert-excel-to-json");

const getLunch = require('./getLunch.js');

const enums = { "조식": 0, "간식": 1, "석식": 2 };

const days = require('./day.json');

let currentFileMonth = 6;
let 장흐응한식 = require('./result.json');


/**@type { { [keyof:string] : { handle : (args: string[], channel: TextBasedChannel, msg: Message<boolean>) => Promise<void> } } } */
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
    async handle(args, channel, msg) {
        channel.send({ embeds: [helpEmbed] });
    }
}

handlers["업데이트"] = {
        /**
     * @param {string[]} args 
     * @param {TextBasedChannel} channel 
     */
    async handle(args, channel, msg) {
        if(msg.author.id != '362896967850000384')
            return;

        try {
            if (msg.attachments.first() && msg.attachments.first().name.includes('xlsx')) {
                //파일 읽는 거
                request.get({
                    url: msg.attachments.first().url, 
                    encoding: null
                }, (err, res, body) => {
                    if (err)
                        throw new Error('무언가 잘못되었나봐요..');
                    else
                        excelParser(parseInt(args[2]), excelToJson({ source: body }));
                });
            }
            else
                throw new Error('파일이 올바르지 않아요!');

            if(args[3] != undefined)
                currentFileMonth = parseInt(args[3]);

            channel.send({ files: ['./result.json'] });
            장흐응한식 = require('./result.json');

            msg.reply(`아마도 성공...? \n**수정내용** \n**[시작날짜 : ${parseInt(args[2]) + 1}일 파일 정보 : ${currentFileMonth}월]**`);
        } catch (err) {
            msg.reply(err.message);
        }
    }
}

handlers["점심"] = handlers["오늘"] = {
    /**
     * @param {string[]} args 
     * @param {TextBasedChannel} channel 
     */
    async handle(args, channel, msg) {
        let date = new Date();

        if (date.getDay() == 6 || date.getDay() == 0) {
            sendNoData(channel, date);
            return;
        }

        let arr = await getLunch(date);
        console.log(arr);
        if (arr == undefined) 
        {
            sendNoData(channel, date);
            return;
        }
        channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(":fork_and_knife:   __**겜마고 급식 정보**__")
                    .addFields([{
                        name: `:spoon: ${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 급식`,
                        value: arr.join("\n") + '\n\n"!급식 도움"을 입력하여 더 많은 명령어를 확인하세요.'
                    }])
                    .setImage(helpEmbedData.image)
                    .setFooter(helpEmbedData.footer)
                    .setColor('#00ff00')
            ]
        });
    }
}


handlers["조식"] = handlers["석식"] = handlers["간식"] = {
    async handle(args, channel, msg) {

        let date = new Date();
        console.log(date);
        if (args.length >= 3 && args[2][args[2].length - 1] != "일") {
            msg.reply('"!급식 도움"을 입력하여 명령어를 확인하세요.');
            return;
        }
        if (currentFileMonth != date.getMonth() + 1) {
            sendNoData(channel, date, args[1]);
            return;
        }
        let day = args.length >= 3 ? args[2].slice(0, args[2].length - 1) : date.getDate();
        if (Number(day) == NaN) {
            msg.reply('"!급식 도움"을 입력하여 명령어를 확인하세요.');
            return;
        }
        date.setDate(day);
        console.log(date);

        let dataInfo = args[1];
        // if(dataInfo == "간식" && date.getDay() == 5) {
        //     sendNoData(channel, date, dataInfo);
        //     return;
        // }

        console.log(date.getMonth());
        if (장흐응한식[day] == undefined || day <= 0) {
            msg.reply('"!급식 도움"을 입력하여 명령어를 확인하세요.');
            return;
        }
        let list = 장흐응한식[day][enums[args[1]]];

        if (list.length <= 0)
            sendNoData(channel, date, dataInfo);
        else
            channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(":fork_and_knife:   __**겜마고 급식 정보**__")
                        .addFields([{
                            name: `:spoon: ${date.getFullYear()}년 ${date.getMonth() + 1}월 ${day}일 ${days[date.getDay()]} ${dataInfo}`,
                            value: list.join("\n") + '\n\n"!급식 도움"을 입력하여 더 많은 명령어를 확인하세요.'
                        }])
                        .setImage(helpEmbedData.image)
                        .setFooter(helpEmbedData.footer)
                        .setColor('#00ff00')
                ]
            });
    }
};

handlers["내일"] = {
    /**
     * @param {string[]} args 
     * @param {TextBasedChannel} channel 
     */
    async handle(args, channel, msg) {
        let date = new Date();
        date.setDate(date.getDate() + 1);
        if (date.getDay() == 6 || date.getDay() == 0) {
            sendNoData(channel, date);
            return;
        }
        let arr = await getLunch(date);
        if (!arr) 
        {
            sendNoData(channel, date);
            return;
        }
        channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(":fork_and_knife:   __**겜마고 급식 정보**__")
                    .addFields([{
                        name: `:spoon: ${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 급식`,
                        value: arr.join("\n") + '\n\n"!급식 도움"을 입력하여 더 많은 명령어를 확인하세요.'
                    }])
                    .setImage(helpEmbedData.image)
                    .setFooter(helpEmbedData.footer)
                    .setColor('#00ff00')
            ]
        });
    }
}

handlers["내놔"] = {
    async handle() {

    }
}

function sendNoData(channel, date, dataInfo = "급식") {
    console.log(date.getDay());
    channel.send({
        embeds: [
            new EmbedBuilder()
                .setTitle(":fork_and_knife:   __**겜마고 급식 정보**__")
                .addFields([{
                    name: `:spoon: ${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${days[date.getDay()]} ${dataInfo}`,
                    value: `${dataInfo} 정보가 없습니다.` + '\n\n"!급식 도움"을 입력하여 더 많은 명령어를 확인하세요.'
                }])
                .setImage(helpEmbedData.image)
                .setFooter(helpEmbedData.footer)
                .setColor('#00ff00')
        ]
    });
}

module.exports = handlers;