const Instruction = require("../instruction.js");
const Config = require("../config.json");

class IMDB extends Instruction {

    async execute(page){
        console.log("executing...");
        let contents = {
            links: []
        };

        let links = await page.$$eval('a', els => els.map(el => el.href));
        links.map(link => {
            if (link === null || link === undefined || link.indexOf('https://www.imdb.com/title/') !== 0)
                return;
            let newLink = 'https://www.imdb.com/title/' + link.split('/')[4];
            if (contents.links.indexOf(newLink) === -1)
                contents.links.push(newLink);
        });

        console.log(contents);
        return contents;
    }

}

module.exports = IMDB;