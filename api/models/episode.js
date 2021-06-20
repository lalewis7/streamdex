// models
var model = require('./model.js');

class Episode extends model.Model {

    constructor(data){
        super([
            new model.StringAttribute({
                name: "title_id",
                editable: false,
                visible: false,
                adminProtected: true
            }),
            new model.StringAttribute({
                name: "season_id",
                editable: false,
                visible: false,
                adminProtected: true
            }),
            new model.NumberAttribute({
                name: "episode_number",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new model.StringAttribute({
                name: "name",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new model.NumberAttribute({
                name: "runtime",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new model.StringAttribute({
                name: "description",
                editable: true,
                visible: true,
                adminProtected: true
            })
        ], data);
    }
}

module.exports = Episode;