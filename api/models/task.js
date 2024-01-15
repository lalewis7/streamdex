// controlers
const taskController = require('../controllers/dc.task.js');
const linkController = require('../controllers/dc.links.js');

// models
const {Model, Attribute, StringAttribute, NumberAttribute} = require('./model.js');
const BotLinks = require('./botlinks.js');

// helpers
const crypto = require('crypto');
var config = require('../config.json');

class Task extends Model {

    constructor(data){
        super([
            new StringAttribute({
                name: "id",
                db_name: "task_id",
                editable: false,
                visible: true,
                adminProtected: true
            }),
            new StringAttribute({
                name: "link_id",
                editable: true,
                visible: false,
                adminProtected: true
            }),
            new LinkAttribute({
                name: "link",
                editable: false,
                visible: true,
                adminProtected: true
            }),
            new StringAttribute({
                name: "type",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new NumberAttribute({
                name: "started",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new NumberAttribute({
                name: "ended",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new StringAttribute({
                name: "status",
                editable: true,
                visible: true,
                adminProtected: true
            })
        ], data);
    }

    async init(){
        let link = await linkController.getLink(this.get().link_id).then(res => res[0]);
        this.link.value = new BotLinks(link);
    }

    async insert(){
        const id = await getNewID();
        // update id and password
        this.override({ id: id });
        let b = this.get();
        await taskController.insertTask(b.id, b.link_id, b.type, b.status)
    }

    async save(){
        let b = this.get();
        await taskController.editTask(b.id, b.link_id, b.type, b.status, b.started, b.ended);
    }

    async delete(){
        let b = this.get();
        await taskController.deleteTask(b.id);
    }

}

class LinkAttribute extends Attribute {

    constructor(config) {
        super(config);
        this.defaultValue = null;
        this.validate = (val) => {
            if (typeof val !== 'object' || !Array.isArray(val))
                return false;
            for (let v of val)
                if (!new BotLinks().validate(v, {admin: true}))
                    return false;
            return true;
        };
    }

    getValue(visibleOnly){
        if (this.value)
            return this.value.get(visibleOnly);
        return null;
    }

}

function getNewID(){
    // create random id
    let id = crypto.randomBytes(config.task_id_length).toString('hex');
    return taskController.getTask(id).then(tasks => {
        // id does not exist
        if (tasks.length == 0)
            return id;
        // id exists try again
        return getNewID();
    })
}

module.exports = Task;