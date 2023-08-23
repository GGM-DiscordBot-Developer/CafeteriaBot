import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionData, ApplicationCommandOptionType, APIEmbed } from "discord.js";
import { Command } from "../Command";
import iconv from "iconv-lite";
import axios from "axios";
import { CheerioAPI, load } from "cheerio";
import { EMBED_IMAGE, FOOTER_ICON } from "../Define";
import {} from "../../../SEH00N/src/DB";

export const menuEmbed: APIEmbed = {
    title: ":fork_and_knife:   __**겜마고 급식 정보**__",
    image: {url: EMBED_IMAGE as string, },
    color: 0x00ff00,
    footer: {
        text: "만든 애 : 박세훈, 곽석현",
        icon_url: FOOTER_ICON
    }
}

const dateOption: ApplicationCommandOptionData = {
    name: "날짜",
    description: "급식을 조회할 날짜(일)",
    type: ApplicationCommandOptionType.Number,
    required: false
}

const options: ApplicationCommandOptionData[] = [dateOption];

export const lunch: Command = {
    name: "급식",
    description: "Get Lunch data",
    type: ApplicationCommandType.ChatInput,
    options,
    run: async (client: Client, interaction: CommandInteraction) => {
        let now = new Date();
        let date: number = interaction.options.get(dateOption.name, dateOption.required)?.value as number;
        if(!date) date = now.getDate();

        let lunchs: string[] = await getLunchTable(date);
        let embed = {...menuEmbed};
        embed.fields = [{
            name: `:spoon: ${now.getFullYear()}년 ${now.getMonth() + 1}월 ${date}일 급식`,
            value: lunchs.join("\n") + '\n\n"!급식 도움"을 입력하여 더 많은 명령어를 확인하세요.',
        }]
        
        await interaction.followUp({
            ephemeral: true,
            embeds: [embed],
        });
    }
};

async function getLunchTable(date: number): Promise<string[]> {
    let dateParam = getDateFormat(date);
    const url :string = `https://ggm.hs.kr/lunch.view?date=${dateParam}`;

    let html = await axios({url, method:"GET", responseType:"arraybuffer"});
    
    let data : Buffer = html.data;
    let decoded = iconv.decode(data, "euc-kr");

    const $ : CheerioAPI = load(decoded);

    let text:string = $(".menuName > span").text();
    let menus:string[] = text.split("\n").map(x => x.replace(/[0-9]+\./g, "")).filter(x => x.length > 0);
    return menus;
}

function getDateFormat(date?: number){
    let now = new Date();
    let year = now.getFullYear();
    let month = ("0" + (1 + now.getMonth())).slice(-2);
    let day = ("0" + now.getDate()).slice(-2);
    if(date != undefined) {
        day = ("0" + date).slice(-2);
    }

    return year + month + day;
}