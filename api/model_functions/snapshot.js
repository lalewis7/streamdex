// controllers
const snapshotController = require('../controllers/dc.snapshot.js');

// models
const Snapshot = require('../models/snapshot.js');

// helpers
const {dataMissingParameter, editModel, snapshotExists} = require('./common.js');

function getLinkSnapshots(link_id){
    let snapshots = [];
    return snapshotController.getSnapshots(link_id)
        .then(dbsnapshots => {
            let initPromises = [];
            for (let snapData of dbsnapshots){
                let snap = new Snapshot(snapData);
                initPromises.push(snap.init());
                snapshots.push(snap);
            }
            return Promise.all(initPromises);
        })
        .then(() => {
            let viewable = [];
            snapshots.map((snap) => {
                viewable.push(snap.get(true));
            })
            return viewable;
        })
}

function createSnapshot(link_id, data, requester){
    // ensure all parameters exist
    let param;
    if (param = dataMissingParameter(data, ["task_id"]))
        return Promise.reject("Missing " + param + " parameter.");
    let s = new Snapshot();
    s.override({link_id: link_id});
    return editModel(s, data, requester)
        .then(() => {
            return s.insert();
        })
        .then(() => {
            return s.get().timestamp
        });
}

function getLatestSnapshot(link_id){
    return snapshotController.getCurrentShapshot(link_id)
        .then(res => {
            if (res.length === 0)
                return Promise.reject({http_msg: "Snapshot does not exist.", http_code: 404});
            let s = new Snapshot(res[0]);
            return s.init()
                .then(() => {
                    return s.get(true);
                })
        })
}

function editSnapshot(task_id, data, requester){
    let snapshot;
    return snapshotExists(task_id)
        .then(res => {
            snapshot = new Snapshot(res[0]);
            return editModel(snapshot, data, requester);
        })
        .then(() => {
            return snapshot.save();
        })
}

function getSnapshot(task_id){
    let snapshot;
    return snapshotExists(task_id)
        .then(res => {
            snapshot = new Snapshot(res[0]);
            return snapshot.init();
        })
        .then(() => {
            return snapshot.get(true);
        })
}

function deleteSnapshot(task_id){
    let snapshot;
    return snapshotExists(task_id)
        .then(res => {
            snapshot = new Snapshot(res[0]);
            return snapshot.init();
        })
        .then(() => {
            return snapshot.delete();
        })
}


module.exports = {
    getLinkSnapshots,
    createSnapshot,
    getLatestSnapshot,
    getSnapshot,
    editSnapshot,
    deleteSnapshot
}