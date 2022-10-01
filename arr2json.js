const fs = require('fs');

const arr = require('./arrdata.json');
const jsonDataPath = './result.json';

const arr2json = function () {
    let result = {};

    let count = 0;
    let date = -3;
    let baseDate = -3;

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

exports.arr2json = arr2json;