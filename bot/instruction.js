const puppeteer = require('puppeteer');

class Instruction {

    constructor(url){
        this.url = url;
    }

    async prepare(page){
        console.log("preparing...");
        await page.goto(this.url);
    }

    async execute(page){}

    async close(page){
        console.log("closing...");
        await page.close();
    }

}

module.exports = Instruction;