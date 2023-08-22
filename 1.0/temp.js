const excelToJson = require('convert-excel-to-json');

console.log((excelToJson({
    sourceFile: './excel.xlsx'
})));