// controlers
const episodeController = require('../controllers/episode.js');
const botController = require('../controllers/dc.bot.js');

// models
const {Model, StringAttribute, BooleanAttribute} = require('./model.js');
const {AvailabilityAttribute, EpisodeLink, getAvailables} = require('../models/links.js');

// helpers
const crypto = require('crypto');
var config = require('../config.json');

class Bot extends Model {

    constructor(data){
        super([
            new StringAttribute({
                name: "id",
                db_name: "bot_id",
                editable: false,
                visible: true,
                adminProtected: true
            }),
            new StringAttribute({
                name: "controller",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new BooleanAttribute({
                name: "online",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new BooleanAttribute({
                name: "running",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new StringAttribute({
                name: "current_process",
                editable: true,
                visible: true,
                adminProtected: true
            })
        ], data);
    }

    async init(){}

    async insert(){
        const id = await getNewID();
        // update id and password
        this.override({ id: id });
        let b = this.get();
        await botController.createBot(b.id, b.controller, b.online, b.running, b.current_process);
    }

    async save(){
        let b = this.get();
        await botController.editBot(b.id, b.controller, b.online, b.running, b.current_process);
    }

    async delete(){
        let b = this.get();
        await botController.deleteBot(b.id);
    }

}

function getNewID(){
    // create random id
    let id = crypto.randomBytes(config.bot_id_length).toString('hex');
    return botController.getBot(id).then(bots => {
        // id does not exist
        if (bots.length == 0)
            return id;
        // id exists try again
        return getNewID();
    })
}

module.exports = Bot;