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
exports.GetMeal = exports.UpdateMeal = exports.Pool = void 0;
const Secret_1 = require("./Secret");
const promise_1 = __importDefault(require("mysql2/promise"));
exports.Pool = promise_1.default.createPool(Secret_1.dbConfig);
const UpdateMeal = function (startDate, date, type, meal) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = 'INSERT INTO meals(date, type, meal) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE meal = ?';
        const dateValue = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${date}`;
        let mealValue = JSON.stringify(meal);
        if (mealValue == undefined)
            return;
        yield exports.Pool.execute(sql, [dateValue, type, mealValue, mealValue]);
    });
};
exports.UpdateMeal = UpdateMeal;
const GetMeal = function (date, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = 'SELECT meal FROM meals where date = ? AND type = ?';
        const dateValue = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        let [row, col] = yield exports.Pool.query(sql, [dateValue, type]);
        return row.length > 0 ? JSON.parse(row[0]['meal']) : null;
    });
};
exports.GetMeal = GetMeal;
