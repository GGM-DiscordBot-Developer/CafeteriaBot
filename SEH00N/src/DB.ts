import { dbConfig } from "./Secret";
import mysql from 'mysql2/promise';
import { MealType } from "./types";

export const Pool = mysql.createPool(dbConfig);
export const UpdateMeal = async function(startDate:Date, date:string, type:MealType, meal:string[]) {
    const sql = 'INSERT INTO meals(date, type, meal) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE meal = ?';
    const dateValue = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${date}`;
    let mealValue = JSON.stringify(meal);

    if(mealValue == undefined)
        return;

    await Pool.execute(sql, [dateValue, type, mealValue, mealValue]);
};