// controllers
const listController = require('../controllers/list.js');
const listTitlesController = require('../controllers/list.titles.js');

// models
const {Model, Attribute, StringAttribute, NumberAttribute} = require('./model.js');

// helpers
const crypto = require('crypto');
var config = require('../config.json');

class List extends Model {

    constructor(data){
        super([
            new StringAttribute({
                name: "id",
                db_name: "list_id",
                editable: false,
                visible: true,
                adminProtected: true
            }),
            new StringAttribute({
                name: "name",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new NumberAttribute({
                name: "updated",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new ListTitlesAttribute({
                name: "titles",
                editable: true,
                visible: true,
                adminProtected: true
            })
        ], data);
    }

    async init(){
        // titles
        let l = this.get();
        const titles = await listTitlesController.getListTitles(l.id);
        for (let title of titles){
            let lt = new ListTitle(title);
            this.titles.value.push(lt);
        }
    }

    async insert(){
        const id = await getNewID();
        // update id and password
        this.override({ id: id });
        let l = this.get();
        await listController.insertList(l.id, l.name, Date.now());
        for (let title of l.titles) {
            await listTitlesController.insertListTitle(l.id, title.title_id, title.ranking);
        }
    }

    async save(){
        let l = this.get();
        await listController.editList(l.id, l.name, Date.now());
        await listTitlesController.deleteAllListTitles(l.id);
        for (let title of l.titles){
            await listTitlesController.insertListTitle(l.id, title.title_id, title.ranking);
        }
    }

    async delete(){
        let l = this.get();
        await listController.deleteList(l.id);
        await listTitlesController.deleteAllListTitles(l.id);
    }

}

class ListTitle extends Model {

    constructor(data){
        super([
            new StringAttribute({
                name: "list_id",
                editable: false,
                visible: false,
                adminProtected: true
            }),
            new StringAttribute({
                name: "title_id",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new NumberAttribute({
                name: "ranking",
                editable: true,
                visible: true,
                adminProtected: true
            })
        ], data);
    }

    async insert(){
        let l = this.get();
        await listTitlesController.insertListTitle(l.list_id, l.title_id, l.ranking);
    }

    async save(){
        let l = this.get();
        await listTitlesController.editListTitle(l.list_id, l.title_id, l.ranking);
    }

    async delete(){
        let l = this.get();
        await listTitlesController.deleteListTitle(l.list_id, l.title_id);
    }

}

class ListTitlesAttribute extends Attribute {

    constructor(conf) {
        super(conf);
        this.defaultValue = [];
        this.validate = (val) => {
            if (typeof val !== 'object' || !Array.isArray(val))
                return false;
            for (let v of val)
                if (!new ListTitle().validate(v, {admin: true}))
                    return false;
            return true;
        };
        this.initValue = (list, val, requester) => {
            let titles = [];
            for (let v of val){
                let ltitle = new ListTitle({list_id: list.get().id});
                ltitle.edit(v, requester);
                titles.push(ltitle);
            }
            return titles;
        }
    }

    getValue(visibleOnly){
        let vals = [];
        for (let val of this.value)
            vals.push(val.get(visibleOnly));
        return vals;
    }

}

function getNewID(){
    // create random id
    let id = crypto.randomBytes(config.list_id_length).toString('hex');
    return listController.getList(id).then(lists => {
        // id does not exist
        if (lists.length == 0)
            return id;
        // id exists try again
        return getNewID();
    })
}

module.exports = List;