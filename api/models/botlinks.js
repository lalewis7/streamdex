// controlers
const linkController = require('../controllers/dc.links.js');

// models
const {Model, StringAttribute} = require('./model.js');

// helpers
const crypto = require('crypto');
var config = require('../config.json');

class BotLinks extends Model {

    constructor(data){
        super([
            new StringAttribute({
                name: "id",
                db_name: "link_id",
                editable: false,
                visible: true,
                adminProtected: true
            }),
            new StringAttribute({
                name: "link",
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
        await linkController.insertLink(b.id, b.link);
    }

    async save(){
        let b = this.get();
        await linkController.updateLink(b.id, b.link);
    }

    async delete(){
        let b = this.get();
        await linkController.deleteLink(b.id);
    }

}

function getNewID(){
    // create random id
    let id = crypto.randomBytes(config.bot_links_id_length).toString('hex');
    return linkController.getLink(id).then(tasks => {
        // id does not exist
        if (tasks.length == 0)
            return id;
        // id exists try again
        return getNewID();
    })
}

module.exports = BotLinks;