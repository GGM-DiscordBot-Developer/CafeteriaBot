"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const excelReader_1 = require("./excelReader");
let date = new Date();
date.setDate(13);
(0, excelReader_1.parse)(date);
