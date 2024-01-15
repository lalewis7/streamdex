// models
const {Model, NumberAttribute, BooleanAttribute} = require('./model.js');

const fs = require('fs');

class Bot extends Model {

    constructor(data){
        super([
            new BooleanAttribute({
                name: "running",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new NumberAttribute({
                name: "threads",
                editable: false,
                visible: true,
                adminProtected: true
            })
        ], data);
    }

    async init(){
        let config = require('../bot_config.json');
        this.edit(config, {admin: true});
    }

    async insert(){}

    async save(){
        let config = this.get(false);
        let data = JSON.stringify(config, null, 2);
        fs.writeFileSync('../bot_config.json', data);
    }

    async delete(){}

}

module.exports = Bot;