const BotController = require("../botcontroller.js");
const IMDB = require('../snapshots/imdb.snapshot.js');
const IMDBCrawler = require('../crawlers/imdb.crawler.js');
const RottenTomatoes = require('../snapshots/rt.snapshot.js');

class IMDBCrawlerController extends BotController {

    start(bot){
        bot.init().then(() => {
            bot.start();
            bot.scheduleInstruction(new IMDBCrawler("https://www.imdb.com/title/tt3480822"));
            bot.scheduleInstruction(new IMDB("https://www.imdb.com/title/tt3521164/"));
            bot.scheduleInstruction(new IMDB("https://www.imdb.com/title/tt6334354/"));
            bot.scheduleInstruction(new RottenTomatoes("https://www.rottentomatoes.com/m/moana_2016"));
        })
    }

}

/*
#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-9b716f3b-0.hWwhTB > section > div:nth-child(4) > section > section > div.sc-80d4314-0.fjPRnj > div.sc-80d4314-1.fbQftq > h1
#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-9b716f3b-0.hWwhTB > section > div:nth-child(4) > section > section > div.sc-80d4314-0.fjPRnj > div.sc-80d4314-1.fbQftq > h1
*/

module.exports = IMDBCrawlerController;