
const Bot = require('./bot.js');
const IMDB = require('./imdb.js');

let bot = new Bot({headless: true, defaultViewport: {width: 1920, height: 1080}});

bot.init().then(() => {
    bot.start();
    bot.scheduleInstruction(new IMDB("https://www.imdb.com/title/tt3521164/"));
})