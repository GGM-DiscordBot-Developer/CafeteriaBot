import { Pool, UpdateMeal } from "./DB";
import { MealType } from "./types";

const excelToJson = require('convert-excel-to-json');

const morningNDinnerLen:number = 8;

const readExcelFile = function(month:number) {
    let excel = excelToJson({ sourceFile: `./${month}.xlsx` });
    return excel;
}

// 엑셀 첫번째 날 - 1 == startDate
const excelParser = function(excel:{[key: string]: {[key: string]: string}[]}) {
    const rows:{[key: string]: string}[] = excel[Object.keys(excel)[0]];
    const weekData:string[] = ['B', 'D', 'F', 'H', 'J'];
    let data:any = []
    let value:any = [];
    
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
}

const arr2json = function (arrData:[], startDate:number) {
    let result:{[key:number]:string[][]} = {};

    let count = 0;
    let date = startDate;
    let baseDate = date;

    for(let i = 0; i < arrData.length;) {
        if (result[date + 1] == undefined) 
            result[date + 1] = [];

        if(date >= baseDate + 5)
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
}

export const parse = async function(startDate:Date) {
    let arrData = excelParser(readExcelFile(startDate.getMonth() + 1));
    let result:{[type:string]:string[][]} = arr2json(arrData, startDate.getDate());

    // date == string 배열의 배열 == [ ['asd', 'asd'], ['asd', 'asd'] ]
    for(let date in result)
    {
        // breakfast => result[date][0]
        UpdateMeal(startDate, date, MealType.Breakfast, result[date][0]);

        // dinner => result[date][1]
        UpdateMeal(startDate, date, MealType.Dinner, result[date][1]);
    }
}