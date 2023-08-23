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
exports.parse = void 0;
const DB_1 = require("./DB");
const types_1 = require("./types");
const excelToJson = require('convert-excel-to-json');
const morningNDinnerLen = 8;
const readExcelFile = function (month) {
    let excel = excelToJson({ sourceFile: `./${month}.xlsx` });
    return excel;
};
// 엑셀 첫번째 날 - 1 == startDate
const excelParser = function (excel) {
    const rows = excel[Object.keys(excel)[0]];
    const weekData = ['B', 'D', 'F', 'H', 'J'];
    let data = [];
    let value = [];
    rows.forEach((row, index) => {
        Object.entries(row).forEach(cell => {
            if (cell[1] == '조식' || cell[1] == '석식') {
                for (let i = 0; i < weekData.length; i++) {
                    for (let j = index; j < index + morningNDinnerLen; j++) {
                        if (rows[j][weekData[i]] != undefined && rows[j][weekData[i]] != 'a') {
                            value.push(rows[j][weekData[i]]);
                        }
                    }
                    data.push(value);
                    value = [];
                }
            }
        });
    });
    return data;
};
const arr2json = function (arrData, startDate) {
    let result = {};
    let count = 0;
    let date = startDate;
    let baseDate = date;
    for (let i = 0; i < arrData.length;) {
        if (result[date + 1] == undefined)
            result[date + 1] = [];
        if (date >= baseDate + 5)
            result[date + 1].push();
        else
            result[date + 1].push(arrData[i++]);
        date++;
        if (date == baseDate + 7) // 한 주에 5개 요일 == baseDate + 5
            date = baseDate;
        count++;
        if (count == 14) { // 조식, 석식 2개의 칸 5개의 요일 모두 돌면 카운트가 10이됨 => 2 * 5
            count = 0;
            baseDate += 7;
            date = baseDate;
        }
    }
    return result;
};
const parse = function (startDate) {
    return __awaiter(this, void 0, void 0, function* () {
        let arrData = excelParser(readExcelFile(startDate.getMonth() + 1));
        let result = arr2json(arrData, startDate.getDate());
        // date == string 배열의 배열 == [ ['asd', 'asd'], ['asd', 'asd'] ]
        for (let date in result) {
            // breakfast => result[date][0]
            (0, DB_1.UpdateMeal)(startDate, date, types_1.MealType.Breakfast, result[date][0]);
            // dinner => result[date][1]
            (0, DB_1.UpdateMeal)(startDate, date, types_1.MealType.Dinner, result[date][1]);
        }
    });
};
exports.parse = parse;
