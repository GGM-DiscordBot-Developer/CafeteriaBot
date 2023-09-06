"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Commands_1 = require("../Commands");
exports.default = (client) => {
    client.on("interactionCreate", (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            yield handleSlashCommand(client, interaction);
        }
    }));
};
const handleSlashCommand = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const slashCommand = Commands_1.commands.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        interaction.followUp({ content: "An error has occurred" });
        return;
    }
    yield interaction.deferReply();
    slashCommand.run(client, interaction);
});
