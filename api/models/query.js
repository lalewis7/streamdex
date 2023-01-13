// controllers
const queryController = require('../controllers/dc.queries.js');
const searchController = require('../controllers/dc.searches.js');

// models
const {Model, Attribute, StringAttribute} = require('./model.js');
const Search = require('./search.js');

class Queries extends Model {

    constructor(data){
        super([
            new StringAttribute({
                name: "query",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new SearchesAttribute({
                name: "sites",
                editable: true,
                visible: true,
                adminProtected: true
            })
        ], data);
    }

    async init(){
        // episodes
        const searches = await searchController.getQuerySearches(this.get().query);
        for (let val of searches){
            let search = new Search(val);
            await search.init();
            this.episodes.value.push(search);
        }
    }

    async insert(){
        let q = this.get();
        await queryController.insertQuery(q.query);
    }

    async save(){}

    async delete(){
        let q = this.get();
        await queryController.deleteQuery(q.query);
        await searchController.deleteAllQuerySearches(q.query);
    }

}

class SearchesAttribute extends Attribute {

    constructor(config) {
        super(config);
        this.defaultValue = [];
        this.validate = (val) => {
            if (typeof val !== 'object' || !Array.isArray(val))
                return false;
            for (let v of val)
                if (!new Search().validate(v, {admin: true}))
                    return false;
            return true;
        };
        this.initValue = (model, val, requester) => {
            let searches = [];
            for (let v of val){
                let search;
                for (let e of model.searches.value)
                    if (e.get().query == v.query)
                        search = e;
                if (search == undefined)
                    search = new Search({query:  model.get().query});
                search.edit(v, requester);
                searches.push(search);
            }
            return searches;
        }
    }

    getValue(visibleOnly){
        let vals = [];
        for (let val of this.value)
            vals.push(val.get(visibleOnly));
        return vals;
    }

}

module.exports = Queries;