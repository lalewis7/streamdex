// controllers
const searchController = require('../controllers/dc.searches.js');
const taskController = require('../controllers/dc.task.js');

// models
const {Model, Attribute, StringAttribute, NumberAttribute} = require('./model.js');
const Task = require('./task.js');

class Search extends Model {

    constructor(data){
        super([
            new StringAttribute({
                name: "query",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new StringAttribute({
                name: "site",
                editable: true,
                visible: true,
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
        let q = this.get();
        await searchController.insertSearch(q.query, q.site, q.task_id);
    }

    async save(){
        let q = this.get();
        await searchController.updateSearch(q.query, q.site, q.task_id);
    }

    async delete(){
        let q = this.get();
        await searchController.deleteSearch(q.query, q.site);
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

module.exports = Search;