const BotController = require("../botcontroller.js");
const IMDB = require('../snapshots/imdb.snapshot.js');
const IMDBCrawler = require('../crawlers/imdb.crawler.js');
const RottenTomatoes = require('../snapshots/rt.snapshot.js');

class IMDBCrawlerController extends BotController {

    start(bot){
        bot.init().then(() => {
            bot.start();
            bot.scheduleInstruction(new IMDBCrawler("https://www.imdb.com/title/tt3480822"));
            bot.scheduleInstruction(new IMDB("https://www.imdb.com/title/tt6334354/"));
            bot.scheduleInstruction(new IMDB("https://www.imdb.com/title/tt3521164/"));
            bot.scheduleInstruction(new RottenTomatoes("https://www.rottentomatoes.com/m/moana_2016"));
        })
    }

}

module.exports = IMDBCrawlerController;