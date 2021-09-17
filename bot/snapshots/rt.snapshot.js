const Instruction = require("../instruction.js");
const Config = require("../config.json");

class RottenTomatoes extends Instruction {

    async execute(page){
        console.log("executing...");
        let contents = {};
        // title
        try{
            await page.waitForSelector(Config.RottenTomatoes.title);
            contents.title = await page.$eval(Config.RottenTomatoes.title, el => el.getAttribute('content'));
        } catch(err){
            console.log('Failed to collect title');
        }
        // maturity
        try{
            await page.waitForSelector(Config.RottenTomatoes.maturity_rating);
            contents.maturity_rating = (await page.$eval(Config.RottenTomatoes.maturity_rating, el => el.innerText)).split('(')[0].trim();
        } catch(err){
            console.log('Failed to collect maturity_rating');
        }
        // rating
        try{
            await page.waitForSelector(Config.RottenTomatoes.rating_1);
            contents.rating = await page.evaluate((r1, r2, r3) => {
                return document.querySelector(r1).shadowRoot.querySelector(r2).shadowRoot.querySelector(r3).innerText;
            }, Config.RottenTomatoes.rating_1, Config.RottenTomatoes.rating_2, Config.RottenTomatoes.rating_3);
        } catch(err){
            console.log(err);
            console.log('Failed to collect rating');
        }
        // release date
        try{
            await page.waitForSelector(Config.RottenTomatoes.rel_date);
            contents.rel_date = await page.$eval(Config.RottenTomatoes.rel_date, el => el.innerText);
        } catch(err){
            console.log('Failed to collect rel_date');
        }
        // runtime
        try{
            await page.waitForSelector(Config.RottenTomatoes.runtime);
            let runtimeText = (await page.$eval(Config.RottenTomatoes.runtime, el => el.innerText)).match(/([0-9]+[a-z]+)/gi);
            contents.runtime = 0;
            runtimeText.map(len => {
                if (len.length >= 2 && len.charAt(len.length - 1) === 'h')
                    contents.runtime += Number.parseInt(len.substring(0, len.length - 1)) * 60;
                else if (len.length >= 2 && len.substring(len.length - 1) === 'm')
                    contents.runtime += Number.parseInt(len.substring(0, len.length - 1));
            })
        } catch(err){
            console.log('Failed to collect runtime');
        }
        // genres
        try{
            await page.waitForSelector(Config.RottenTomatoes.genres);
            contents.genres = (await page.$eval(Config.RottenTomatoes.genres, el => el.innerText)).split(',').map(el => el.trim());
        } catch(err){
            console.log('Failed to collect genres');
        }
        // description
        try{
            await page.waitForSelector(Config.RottenTomatoes.description);
            contents.description = await page.$eval(Config.RottenTomatoes.description, el => el.innerText);
        } catch(err){
            console.log('Failed to collect description');
        }
        console.log(contents);
        return contents;
    }

}

module.exports = RottenTomatoes;