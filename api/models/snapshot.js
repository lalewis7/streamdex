// controlers
const snapshotController = require('../controllers/dc.snapshot.js');

// models
const {Model, StringAttribute, NumberAttribute} = require('./model.js');

class Task extends Model {

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
                adminProtected: true
            }),
            new NumberAttribute({
                name: "timestamp",
                editable: true,
                visible: true,
                adminProtected: true
            })
        ], data);
    }

    async init(){}

    async insert(){
        // update id and password
        this.override({ timestamp: Date.now() });
        let b = this.get();
        await snapshotController.insertSnapshot(b.link_id, b.timestamp, b.data);
    }

}

module.exports = Task;