const req = require('request'); // ?
const fs = require('fs');
const schoolData = require('./schoolData.json');

const url = "https://open.neis.go.kr/hub/mealServiceDietInfo?";
const key = `KEY=${schoolData.key}&`;
const type = "Type=json&";
const localCode = `ATPT_OFCDC_SC_CODE=${schoolData.localCode}&`;
const schoolCode = `SD_SCHUL_CODE=${schoolData.schoolCode}&`;

/**
 * @param {Date} date 
 */
function getLunchData(date, callback) {
    let result;
    req.get(url + key + type + localCode + schoolCode + getDateFormat(date), 
    (err, res, body) => {
        if(err) {
            console.log(err);
            callback(undefined);
            return;
        };
        try{ callback(JSON.parse(body)); }
        catch(error) {
            callback(undefined);
        }
    });
}

/**
 * @param {Date} date 
 */
function getDateFormat(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if(month < 10) month = "0" + month.toString();
    else month = month.toString();
    if(day < 10) day = "0" + day.toString();
    else day = day.toString();
    return `MLSV_YMD=${date.getFullYear()}${month}${day}`;
}

exports.getLunch = (date, callback) => {
    getLunchData(date, (result) => {
        if(!result) {callback(undefined); return;}
        /** @type {string[]} */
        let arr = result.mealServiceDietInfo[1].row[0].DDISH_NM.split('<br/>');
        if(!result.mealServiceDietInfo) {callback(undefined); return;}
        for(let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].replaceAll("★", "");
            arr[i] = arr[i].replaceAll("(", "");
            arr[i] = arr[i].replaceAll(")", "");
            arr[i] = arr[i].replaceAll(".", "");
            arr[i] = arr[i].replaceAll(" ", "");
            for(let j = 0; j < 10; j++) {
                arr[i] = arr[i].replaceAll(j.toString(), "");
            }
        }
        callback(arr);
    });
}