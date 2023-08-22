import { Client, ClientOptions } from "discord.js";
import dotenv from "dotenv";
import ready from "./listeners/Ready";
import interactionCreate from "./listeners/InteractionCreate";
dotenv.config();

console.log("Bot is starting...");

const client = new Client({
    intents: []
});

ready(client);
interactionCreate(client);

client.login(process.env.BOT_TOKEN);