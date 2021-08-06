const puppeteer = require('puppeteer');

class Bot {

    constructor(options = {}){
        this.schedule = [];
        this.running = false;
        this.options = options;
    }

    async init(){
        this.browser = await puppeteer.launch(this.options);
    }

    async close(){
        await this.browser.close();
    }

    scheduleInstruction(instruction){
        this.schedule.push(instruction);
    }

    start(){
        if (this.runnin)
            return;
        this.running = true;
        this.run();
    }

    stop(){
        if (!this.running)
            return;
        this.running = false;
        clearInterval(this.interval);
    }

    isRunning(){
        return this.running;
    }

    run(){
        this.interval = setInterval(() => {
            if (!this.running)
                clearInterval(i);
            if (this.schedule.length == 0)
                return;
            clearInterval(this.interval);
            let instruction = this.schedule.shift();
            let page;
            this.browser.newPage().then(p => {
                page = p;
                return instruction.prepare(page);
            })
                .then(() => {
                    return instruction.execute(page);
                })
                .then(() => {
                    return instruction.close(page);
                })
                .then(() => {
                    this.run();
                });
        }, 1000);
    }

}

module.exports = Bot;