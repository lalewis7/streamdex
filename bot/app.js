
const Bot = require('./bot.js');
const IMDB = require('./snapshots/imdb.snapshot.js');
const IMDBCrawler = require('./crawlers/imdb.crawler.js');
const RottenTomatoes = require('./snapshots/rt.snapshot.js');

let bot = new Bot({headless: true, defaultViewport: {width: 1920, height: 1080}});

bot.init().then(() => {
    bot.start();
    bot.scheduleInstruction(new IMDBCrawler("https://www.imdb.com/title/tt3480822"));
    //bot.scheduleInstruction(new IMDB("https://www.imdb.com/title/tt6334354/"));
    //bot.scheduleInstruction(new IMDB("https://www.imdb.com/title/tt3521164/"));
    //bot.scheduleInstruction(new RottenTomatoes("https://www.rottentomatoes.com/m/moana_2016"));
})