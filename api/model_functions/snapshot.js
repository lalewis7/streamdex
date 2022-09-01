// controllers
const snapshotController = require('../controllers/dc.snapshot.js');

// models
const Snapshot = require('../models/snapshot.js');

// helpers
const {dataMissingParameter, editModel} = require('./common.js');

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
            let s = new Snapshot(res[0]);
            return s.init()
                .then(() => {
                    return s.get(true);
                })
        })
}


module.exports = {
    getLinkSnapshots,
    createSnapshot,
    getLatestSnapshot
}