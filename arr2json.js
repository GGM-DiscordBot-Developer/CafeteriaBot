const fs = require('fs');

let stringValue;//require('./arrdata.json');
let arr;
const jsonDataPath = './result.json';

const arr2json = function () {
    stringValue = fs.readFileSync('./arrdata.json').toString();

    stringValue = stringValue.replaceAll('.', '');
    for(let i = 0; i < 10; i++)
        stringValue = stringValue.replaceAll(i, '');
    
    arr = JSON.parse(stringValue);

    let result = {};

    let count = 0;
    let date = -2;
    let baseDate = date;

    arr.forEach(data => {
        if (result[date + 1] == undefined)
            result[date + 1] = [];

        result[date + 1].push(data);

        date++;
        if (date == baseDate + 7)
            date = baseDate;

        count++;
        if (count == 21) {
            count = 0;
            baseDate += 7;
            date = baseDate;
        }
    });

    fs.writeFileSync(jsonDataPath, JSON.stringify(result));
}
arr2json();

exports.arr2json = arr2json;