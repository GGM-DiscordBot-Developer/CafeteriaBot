import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionData, ApplicationCommandOptionType, APIEmbed } from "discord.js";
import { Command } from "../Command";
import iconv from "iconv-lite";
import axios from "axios";
import { CheerioAPI, load } from "cheerio";
import { EMBED_IMAGE, FOOTER_ICON } from "../Define";
import { GetMeal, UpdateMeal } from "../DB";
import { MealType } from "../types";

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
    description: "급식을 조회할 날짜(기본값: 오늘날짜)",
    type: ApplicationCommandOptionType.Number,
    minValue: 1,
    maxValue: 31,
    required: false,
}

const mealTypeOption: ApplicationCommandOptionData = {
    name: "급식종류",
    description: "조회할 급식(기본값: 중식)",
    type: ApplicationCommandOptionType.Integer,
    choices: [
        { name: "조식", value: 0 },
        { name: "중식", value: 1 },
        { name: "석식", value: 2 }
    ],
    required: true
}

const options: ApplicationCommandOptionData[] = [mealTypeOption, dateOption];

export const meal: Command = {
    name: "급식",
    description: "Get Lunch data",
    type: ApplicationCommandType.ChatInput,
    options,
    run: async (client: Client, interaction: CommandInteraction) => {
        let now = new Date();
        let date: number = interaction.options.get(dateOption.name, dateOption.required)?.value as number;
        let mealType: MealType = interaction.options.get(mealTypeOption.name, mealTypeOption.required)?.value as number;
        if(!date) date = now.getDate();

        now.setDate(date);
        let menus:string[] = await GetMeal(now, mealType);

        if(menus == null)
        {
            if(mealType == MealType.Lunch)
            {
                menus = await getMealTable(date, mealType);
                if(menus != null)
                {
                    await UpdateMeal(now, date.toString(), mealType, menus);
                }
            }
        }

        let embed = {...menuEmbed};
        if(menus == null)
        {
            // empty table
            embed.fields = [{
                name: `:spoon: ${now.getFullYear()}년 ${now.getMonth() + 1}월 ${date}일 ${getMealName(mealType)}`,
                value: "급식 정보가 없습니다!" + '\n\n"!급식 도움"을 입력하여 더 많은 명령어를 확인하세요.',
            }]
            
            await interaction.followUp({
                ephemeral: true,
                embeds: [embed],
            });
            return;
        }

        let mealName;
        if(mealType == MealType.Dinner) {
            mealName = "석식";
        }
        else if(mealType == MealType.Lunch) {
            mealName = "급식";
        }
        else mealName = "조식";

        embed.fields = [{
            name: `:spoon: ${now.getFullYear()}년 ${now.getMonth() + 1}월 ${date}일 ${mealName}`,
            value: menus.join("\n") + '\n\n"!급식 도움"을 입력하여 더 많은 명령어를 확인하세요.',
        }]
        
        await interaction.followUp({
            ephemeral: true,
            embeds: [embed],
        });
    }
};

async function getMealTable(date: number, type: MealType): Promise<string[]> {
    
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

function dateToClass(date: number) {
}

function getMealName(type: MealType): string {
    return type == MealType.Breakfast ? "조식" : (type == MealType.Lunch ? "급식" : "석식");
}