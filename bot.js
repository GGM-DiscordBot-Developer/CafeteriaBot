const { Client, GatewayIntentBits, EmbedBuilder, Partials, ActivityType } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages, 
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessageReactions
    ] ,
    partials : [
        Partials.Channel,
        Partials.Message
    ]});

const handlers = require('./handlers.js');
const fs = require('fs');
const { excelParser, readExcelFile } = require('./excelReader.js');
let cnt = require('./count.json').cnt;

let logChannel;

client.on('ready', () => {
    console.log(`[bot.js] Bot ${client.user.tag} is running`);

    //excelParser(0, readExcelFile(5));

    client.user.setActivity({ name: '!급식', type: ActivityType.Playing });
    logChannel = client.channels.cache.get('1055146627310030868');
});

client.on('messageCreate', msg => {
    if(!msg.content.startsWith("!")) return;
    const args = msg.content.replace("!", "").split(" ").filter(a => a != "");
    if(args[0] !== "급식") return;
    
    console.log(`[bot.js] Arguments : ${args}`);
    let date = new Date();
    logChannel.send(`> ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} | ${date.getHours()}:${date.getMinutes()} ${++cnt} \`\`\`[${args}]\`\`\``);
    
    fs.writeFileSync("./count.json", JSON.stringify({cnt}));

    if(args[1] === "" || args[1] == undefined)
        args[1] = "오늘";

    if(handlers[args[1]] === undefined || (typeof(handlers[args[1]].handle) !== "function")) {
        msg.reply('"!급식 도움"을 입력하여 명령어를 확인하세요.');
        return;
    }
    else {
        handlers[args[1]].handle(args, msg.channel, msg);
        
    }
});

client.login(process.env.BOT_TOKEN);
// client.login(require('./token.json'));
// client.login('MTAxNDExMTkxMjM5MDMxNjA3NA.GEaJ9_.ZJ2UxmdFoz3VbduPTS7mzzafozwLKTSqaoE2bA');
