// controlers
const snapshotController = require('../controllers/dc.snapshot.js');
const taskController = require('../controllers/dc.task.js');

// models
const {Model, StringAttribute, Attribute} = require('./model.js');
const Task = require('./task.js');

class Snapshot extends Model {

    constructor(data){
        super([
            new StringAttribute({
                name: "link_id",
                editable: false,
                visible: false,
                adminProtected: true
            }),
            new StringAttribute({
                name: "data",
                editable: true,
                visible: true,
                defaultValue: '{}',
                adminProtected: true
            }),
            new StringAttribute({
                name: "task_id",
                editable: true,
                visible: false,
                adminProtected: true
            }),
            new TaskAttribute({
                name: "task",
                editable: false,
                visible: true,
                adminProtected: true
            })
        ], data);
    }

    async init(){
        let task = await taskController.getTask(this.get().task_id).then(res => res[0]);
        this.task.value = new Task(task);
    }

    async insert(){
        let b = this.get();
        await snapshotController.insertSnapshot(b.link_id, b.task_id, b.data);
    }

    async save(){
        let q = this.get();
        await snapshotController.updateSnapshot(q.task_id, q.data);
    }

    async delete(){
        let q = this.get();
        await snapshotController.deleteSnapshot(q.task_id);
    }

}

class TaskAttribute extends Attribute {

    constructor(config) {
        super(config);
        this.defaultValue = null;
        this.validate = (val) => {
            if (typeof val !== 'object' || !Array.isArray(val))
                return false;
            for (let v of val)
                if (!new Task().validate(v, {admin: true}))
                    return false;
            return true;
        };
        // this.initValue = (model, val, requester) => {
        //     let task = new Task({id: model.get().task_id});
        //     task.edit(val, requester);
        //     return task;
        // }
    }

    getValue(visibleOnly){
        if (this.value)
            return this.value.get(visibleOnly);
        return null;
    }

}

module.exports = Snapshot;