const ExcelReader = require('./excelReader.js');
const { Client, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

var helpEmbed = new EmbedBuilder()
    .setTitle(':fork_and_knife:   __**명령어**__')
    .setColor('#ff9696')
    .setFields(
        { name: '**!급식 도움**', value: '- :speech_balloon: 지금 이 메세지를 출력합니다.' },
        { name: '**!급식 (오늘)**', value: '- :spoon: 오늘의 급식을 알려줍니다.' },
        { name: '**!급식 내일**', value: '- :fork_and_knife: 내일의 급식을 알려줍니다.' },
        { name: '**!급식 n월 n일**', value: '- :date: 해당되는 날짜의 급식을 알려줍니다.' },
        { name: '**!급식 !급식 조식(아침)**', value: '- :chopsticks: 내일의 조식을 알려줍니다.' },
        { name: '**!급식 석식(저녁)**', value: '- :fork_knife_plate: 오늘의 석식을 알려줍니다.' },
        { name: '**!급식 간식**', value: '- :burrito: 오늘의 간식을 알려줍니다.' },
        { name: '**!급식 봇정보**', value: '- :robot: 봇의 정보를 알려줍니다.' }
    );

const dataFile = require('./excelData.json');

client.on('ready', () => {
    client.user.setActivity({ name: '!급식', type: ActivityType.Playing });
    console.log('bot on');
});

client.on('messageCreate', msg => {
    if (!msg.content.startsWith('!급식')) return;

    const args = msg.content.replace('!').split(' ');
    console.log(args);

    switch(args[1])
    {
        case "도움":
            msg.channel.send({ embeds : [helpEmbed] });
            break;
        case "":
        case "오늘":
            break;
        case "내일":
            break;
        case "조식":
            break;
        case "석식":
            break;
    }
});

client.login(require('token.txt'));