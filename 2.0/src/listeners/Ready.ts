import { Client } from "discord.js";
import { commands } from "../Commands";

export default (client: Client) => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }

        let result = await client.application.commands.set(commands);
        console.log(`${client.user?.username} is online`);
    });
}