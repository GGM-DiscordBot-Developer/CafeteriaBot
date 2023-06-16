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
        console.log(res);
        if(err) {
            console.log(err);
            return;
        };
        try{ callback(JSON.parse(body)); }
        catch(error) { 
            console.log(body);
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

module.exports = async function getLunch(now) {
    let uri = `https://ggm.hs.kr/lunch.view?date=${yyyymmdd(now)}`;
    try {
        const html = await axios.get(uri, {responseType: "arraybuffer"});
        const $ = cheerio.load(iconv.decode(html.data, "EUC-KR"));
        let result = $("#morning > div.objContent1 > div > span").text().split("\n");
        result.map((str, idx) => {
            result[idx] = str.replace(str.match(/[0-9].*/g), "");
        });
        return result;
    }
    catch(err) {
        console.error(err);
        return undefined;
    }
}

function yyyymmdd(date) {
    return date.toISOString().slice(0,10).replace(/-/g,"");
}