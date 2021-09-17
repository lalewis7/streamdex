const Instruction = require("../instruction.js");
const Config = require("../config.json");

class IMDB extends Instruction {

    async execute(page){
        console.log("executing...");
        let contents = {};
        // title
        try{
            await page.waitForSelector(Config.IMDB.title);
            contents.title = await page.$eval(Config.IMDB.title, el => el.innerText);
        } catch(err){
            console.log('Failed to collect title');
        }
        // maturity
        try{
            await page.waitForSelector(Config.IMDB.maturity_rating);
            contents.maturity = await page.$eval(Config.IMDB.maturity_rating, el => el.innerText);
        } catch(err){
            console.log('Failed to collect maturity');
        }
        // rating
        try{
            await page.waitForSelector(Config.IMDB.rating);
            contents.rating = await page.$eval(Config.IMDB.rating, el => el.innerText);
        } catch(err){
            console.log('Failed to collect rating');
        }
        // release date
        try{
            await page.waitForSelector(Config.IMDB.rel_date);
            contents.rel_date = (await page.$eval(Config.IMDB.rel_date, el => el.innerText)).split('(')[0];
        } catch(err){
            console.log(err);
            console.log('Failed to collect release date');
        }
        // runtime
        try{
            await page.waitForSelector(Config.IMDB.runtime);
            let runtimeText = (await page.$eval(Config.IMDB.runtime, el => el.innerText)).match(/([0-9]+[a-z]+)/gi);
            contents.runtime = 0;
            runtimeText.map(len => {
                if (len.length >= 2 && len.charAt(len.length - 1) === 'h')
                    contents.runtime += Number.parseInt(len.substring(0, len.length - 1)) * 60;
                else if (len.length >= 4 && len.substring(len.length - 3) === 'min')
                    contents.runtime += Number.parseInt(len.substring(0, len.length - 3));
            })
        } catch(err){
            console.log('Failed to collect runtime');
        }
        // genres
        try{
            await page.waitForSelector(Config.IMDB.genres_list);
            contents.genres = await page.$$eval(Config.IMDB.genre, els => els.map(el => el.innerText));
        } catch(err){
            console.log('Failed to collect genres');
        }
        // description
        try{
            await page.waitForSelector(Config.IMDB.description);
            contents.description = (await page.$eval(Config.IMDB.description, el => el.innerText)).split('—')[0];
        } catch(err){
            console.log('Failed to collect description');
        }
        console.log(contents);
        return contents;
    }

}

module.exports = IMDB;