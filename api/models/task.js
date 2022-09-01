// controlers
const taskController = require('../controllers/dc.task.js');

// models
const {Model, StringAttribute, NumberAttribute} = require('./model.js');

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
                name: "bot_id",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new StringAttribute({
                name: "link_id",
                editable: true,
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

    async init(){}

    async insert(){
        const id = await getNewID();
        // update id and password
        this.override({ id: id });
        let b = this.get();
        await taskController.insertTask(b.id, b.bot_id, b.link_id, b.type, b.status)
    }

    async save(){
        let b = this.get();
        await taskController.editTask(b.id, b.bot_id, b.link_id, b.type, b.status, b.started, b.ended);
    }

    async delete(){
        let b = this.get();
        await taskController.deleteTask(b.id);
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