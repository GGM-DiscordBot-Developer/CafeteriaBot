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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.meal = exports.menuEmbed = void 0;
const discord_js_1 = require("discord.js");
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const Define_1 = require("../Define");
const DB_1 = require("../DB");
const types_1 = require("../types");
exports.menuEmbed = {
    title: ":fork_and_knife:   __**겜마고 급식 정보**__",
    image: { url: Define_1.EMBED_IMAGE, },
    color: 0x00ff00,
    footer: {
        text: "만든 애 : 박세훈, 곽석현",
        icon_url: Define_1.FOOTER_ICON
    }
};
const dateOption = {
    name: "날짜",
    description: "급식을 조회할 날짜(기본값: 오늘날짜)",
    type: discord_js_1.ApplicationCommandOptionType.Number,
    minValue: 1,
    maxValue: 31,
    required: false,
};
const mealTypeOption = {
    name: "급식종류",
    description: "조회할 급식(기본값: 중식)",
    type: discord_js_1.ApplicationCommandOptionType.Integer,
    choices: [
        { name: "조식", value: 0 },
        { name: "중식", value: 1 },
        { name: "석식", value: 2 }
    ],
    required: true
};
const options = [mealTypeOption, dateOption];
exports.meal = {
    name: "급식",
    description: "Get Lunch data",
    type: discord_js_1.ApplicationCommandType.ChatInput,
    options,
    run: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        let now = new Date();
        let date = (_a = interaction.options.get(dateOption.name, dateOption.required)) === null || _a === void 0 ? void 0 : _a.value;
        let mealType = (_b = interaction.options.get(mealTypeOption.name, mealTypeOption.required)) === null || _b === void 0 ? void 0 : _b.value;
        if (!date)
            date = now.getDate();
        now.setDate(date);
        let menus = yield (0, DB_1.GetMeal)(now, mealType);
        if (menus == null) {
            if (mealType == types_1.MealType.Lunch) {
                menus = yield getMealTable(date, mealType);
                if (menus != null) {
                    yield (0, DB_1.UpdateMeal)(now, date.toString(), mealType, menus);
                }
            }
        }
        let embed = Object.assign({}, exports.menuEmbed);
        if (menus == null) {
            // empty table
            embed.fields = [{
                    name: `:spoon: ${now.getFullYear()}년 ${now.getMonth() + 1}월 ${date}일 ${getMealName(mealType)}`,
                    value: "급식 정보가 없습니다!" + '\n\n"!급식 도움"을 입력하여 더 많은 명령어를 확인하세요.',
                }];
            yield interaction.followUp({
                ephemeral: true,
                embeds: [embed],
            });
            return;
        }
        let mealName;
        if (mealType == types_1.MealType.Dinner) {
            mealName = "석식";
        }
        else if (mealType == types_1.MealType.Lunch) {
            mealName = "급식";
        }
        else
            mealName = "조식";
        embed.fields = [{
                name: `:spoon: ${now.getFullYear()}년 ${now.getMonth() + 1}월 ${date}일 ${mealName}`,
                value: menus.join("\n") + '\n\n"!급식 도움"을 입력하여 더 많은 명령어를 확인하세요.',
            }];
        yield interaction.followUp({
            ephemeral: true,
            embeds: [embed],
        });
    })
};
function getMealTable(date, type) {
    return __awaiter(this, void 0, void 0, function* () {
        let dateParam = getDateFormat(date);
        const url = `https://ggm.hs.kr/lunch.view?date=${dateParam}`;
        let html = yield (0, axios_1.default)({ url, method: "GET", responseType: "arraybuffer" });
        let data = html.data;
        let decoded = iconv_lite_1.default.decode(data, "euc-kr");
        const $ = (0, cheerio_1.load)(decoded);
        let text = $(".menuName > span").text();
        let menus = text.split("\n").map(x => x.replace(/[0-9]+\./g, "")).filter(x => x.length > 0);
        return menus;
    });
}
function getDateFormat(date) {
    let now = new Date();
    let year = now.getFullYear();
    let month = ("0" + (1 + now.getMonth())).slice(-2);
    let day = ("0" + now.getDate()).slice(-2);
    if (date != undefined) {
        day = ("0" + date).slice(-2);
    }
    return year + month + day;
}
function dateToClass(date) {
}
function getMealName(type) {
    return type == types_1.MealType.Breakfast ? "조식" : (type == types_1.MealType.Lunch ? "급식" : "석식");
}
