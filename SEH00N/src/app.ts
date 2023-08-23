import { parse } from "./excelReader";
import { GetMeal } from "./DB";
import { MealType } from "./types";
import { RowDataPacket } from "mysql2/promise";

const main = async function() {
    let date = new Date();
    let data:string[] = await GetMeal(date, MealType.Dinner);

    data.forEach(meal => {
        console.log(meal);        
    });
}

main();

// let date:Date = new Date();
// date.setDate(13);
// parse(date);