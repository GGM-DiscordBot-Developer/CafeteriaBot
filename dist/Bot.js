"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const Ready_1 = __importDefault(require("./listeners/Ready"));
const InteractionCreate_1 = __importDefault(require("./listeners/InteractionCreate"));
dotenv_1.default.config();
console.log("Bot is starting...");
const client = new discord_js_1.Client({
    intents: []
});
(0, Ready_1.default)(client);
(0, InteractionCreate_1.default)(client);
client.login(process.env.BOT_TOKEN);
