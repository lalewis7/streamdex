const Instruction = require("./instruction.js");
const Config = require("./config.json");

class IMDB extends Instruction {

    async execute(page){
        console.log("executing...");
        let contents = {};
        // title
        await page.waitForSelector(Config.IMDB.title);
        contents.title = await page.$eval(Config.IMDB.title, el => el.innerText);
        // maturity
        await page.waitForSelector(Config.IMDB.maturity_rating);
        contents.maturity = await page.$eval(Config.IMDB.maturity_rating, el => el.innerText);
        // rating 
        await page.waitForSelector(Config.IMDB.rating);
        contents.rating = await page.$eval(Config.IMDB.rating, el => el.innerText);
        // release date
        await page.waitForSelector(Config.IMDB.rel_date);
        contents.rel_date = (await page.$eval(Config.IMDB.rel_date, el => el.innerText)).split('(')[0];
        // runtime
        await page.waitForSelector(Config.IMDB.runtime);
        let runtimeText = (await page.$eval(Config.IMDB.runtime, el => el.innerText)).match(/([0-9]+[a-z]+)/gi);
        contents.runtime = 0;
        runtimeText.map(len => {
            if (len.length >= 2 && len.charAt(len.length - 1) === 'h')
                contents.runtime += Number.parseInt(len.substring(0, len.length - 1)) * 60;
            else if (len.length >= 4 && len.substring(len.length - 3) === 'min')
                contents.runtime += Number.parseInt(len.substring(0, len.length - 3));
        })
        // genres
        await page.waitForSelector(Config.IMDB.genres_list);
        contents.genres = await page.$$eval(Config.IMDB.genre, els => els.map(el => el.innerText));
        console.log(contents);
    }

}

module.exports = IMDB;