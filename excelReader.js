const readExcelFile = require('read-excel-file/node');

const fs = require('fs');
const { stringify } = require('querystring');
const saveFilePath = './excelData.json';
const excelFilePath = './excel.xlsx';

let dataArr = {}

const excelDataParser = () => {
    readExcelFile(excelFilePath).then(cells => {
        cells.forEach(cell => {
            cell.forEach(data => {
                if(data != null && typeof(data) == 'number' && JSON.stringify(data).length > 4) {
                    let i = ;
                    while(i)
                    dataArr[excelDateParser(data).getDate()] = [];
                }
            });
        });
        fs.writeFileSync(saveFilePath, JSON.stringify(dataArr));
    });
}
excelDataParser();
readExcelFile(excelFilePath).then(cells => {
    fs.writeFileSync('./temp.json', JSON.stringify(cells));
})
const excelDateParser = serial => {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;                                        
    var date_info = new Date(utc_value * 1000);
 
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
 
    var total_seconds = Math.floor(86400 * fractional_day);
 
    var seconds = total_seconds % 60;
 
    total_seconds -= seconds;
 
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
 
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

exports.excelDataParser = excelDataParser;