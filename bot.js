const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

const handlers = require('./handlers.js');

client.on('ready', () => {
    console.log(`[bot.js] Bot ${client.user.tag} is running`);
});

client.on('messageCreate', msg => {
    if(!msg.content.startsWith("!")) return;
    const args = msg.content.replace("!", "").split(" ").filter(a => a != "");
    if(args[0] !== "급식") return;
    
    console.log(`[bot.js] Arguments : ${args}`);

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

client.login(require('./token.json'));
