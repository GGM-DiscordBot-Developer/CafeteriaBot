const excelToJson = require('convert-excel-to-json');
const arr2json = require('./arr2json.js').arr2json;

const fs = require('fs');
const arrFilePath = './arrdata.json';

const snackLen = 3;
const morningNDinnerLen = 7;

const excelParser = function() {
    let date = new Date();

    const result = excelToJson({
        sourceFile: `./4.xlsx`
    });
    console.log(result);
        
    const rows = result[Object.keys(result)[0]];
    const weekData = ['B', 'D', 'F', 'H', 'J', 'L', 'N'];
    let data = []
    let value = [];
    
    rows.forEach((row, index) => {
        Object.entries(row).forEach(cell => {
            if (cell[1] == '조식' || cell[1] == '석식')
                for (let i = 0; i < weekData.length; i++) {
                    for (let j = index; j < index + morningNDinnerLen; j++)
                        if (rows[j][weekData[i]] != undefined && rows[j][weekData[i]] != 'a')
                        {
                            if(rows[j][weekData[i]].includes('/'))
                            {
                                arr = rows[j][weekData[i]].split('/');
                                arr.forEach(e => value.push(e) );
                            }
                            else
                                value.push(rows[j][weekData[i]]);
                        }
                    
                    value.forEach((d, index) => value[index] = d.replaceAll(',', ''));
                    data.push(value);
    
                    value = [];
                }
    
            if (cell[1] == '간식/\r\n주말중식' || cell[1] == '간식')
                for (let i = 0; i < weekData.length; i++) {
                    for (let j = index; j < index + snackLen; j++)
                        if (rows[j][weekData[i]] != undefined && rows[j][weekData[i]] != 'a') {
                            if(rows[j][weekData[i]].includes('\r\n'))
                            {
                                arr = rows[j][weekData[i]].split('\r\n');
                                value.push(arr[0]);
                                value.push(arr[1]);
                            }
                            else if(rows[j][weekData[i]].includes('/'))
                            {
                                arr = rows[j][weekData[i]].split('/');
    
                                arr.forEach(e => {
                                    value.push(e);
                                });
                            }
                            else
                                value.push(rows[j][weekData[i]]);

                            if (weekData[i] == 'L')
                                if (rows[j]['M'] != undefined)
                                    value.push(rows[j]['M']);
    
                            if (weekData[i] == 'N')
                                if (rows[j]['O'] != undefined)
                                    value.push(rows[j]['O']);
                        }
    

                    value.forEach((d, index) => value[index] = d.replaceAll(',', ''));
                    
                    data.push(value);
                    value = [];
                }
        });
    });
    
    fs.writeFileSync('./excelData.json', JSON.stringify(result));
    fs.writeFileSync(arrFilePath, JSON.stringify(data));

    arr2json();
}

excelParser();

exports.excelParser = excelParser;