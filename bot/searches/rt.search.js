const Config = require("../config.json");

async function execute(page){
    console.log("executing...");
    let contents = {
        links: []
    };

    let links = await page.$$eval('a', els => els.map(el => el.href));
    links.map(link => {
        if (link === null || link === undefined || link.indexOf('https://www.rottentomatoes.com/tv/') !== 0 || 
            link.indexOf('https://www.rottentomatoes.com/m/') !== 0)
            return;
        let newLink = 'https://www.rottentomatoes.com/' + link.split('/')[3] + '/' + link.split('/')[4];
        if (contents.links.indexOf(newLink) === -1)
            contents.links.push(newLink);
    });

    console.log(contents);
    return contents;
}

module.exports = execute;