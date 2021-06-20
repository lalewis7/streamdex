class Model {

    constructor(attr, data){
        attr.map(a => {
            this[a.name] = a;
            // from database
            if (data){
                let val = data[a.name];
                if (a.db_name)
                    val = data[a.db_name];
                if (val === undefined)
                    this[a.name].value = a.defaultValue;
                else if (a.convertDbValue)
                    this[a.name].value = a.convertDbValue(val);
                else
                    this[a.name].value = val;
            }
            else {
                this[a.name].value = a.defaultValue;
            }
        });
    }

    validate(data, requester){
        let fails = [];
        for (let key in data){
            let attr = this[key];
            if (!attr || // attribute does not exist
                !attr.editable || // attribute is not editable
                (attr.adminProtected && !requester.admin) || // attribute is admin protected and requester is not admin
                (attr.validate && !attr.validate(data[key]))) // attribute has validate fn and it does not pass
                fails.push(key);
        }
        return fails;
    }

    edit(data, requester){
        let fails = this.validate(data, requester);
        for (let key in data){
            if (!fails.includes(key))
                this[key].value = this[key].initValue(this, data[key], requester);
        }
    }

    override(data){
        for (let key in data)
            this[key].value = data[key];
    }

    get(visibleOnly = false){
        let data = {};
        for (let key in this)
            if (!visibleOnly || this[key].visible)
                data[key] = this[key].getValue(visibleOnly);
        return data;
    }

}

class Attribute {
    
    constructor(config){
        this.name = undefined;
        this.db_name = undefined;
        this.editable = false;
        this.visible = true;
        this.adminProtected = false;
        this.validate = (val) => {return true};
        this.convertDbValue = (val) => {return val};
        this.initValue = (model, val, requester) => {return val};
        this.defaultValue = undefined;
        this.value = undefined;
        // update with any custom config given
        for (let key in config)
            this[key] = config[key];
    }

    getValue(visibleOnly) {
        return this.value;
    }

}

class StringAttribute extends Attribute {

    constructor(config){
        super(config);
        this.defaultValue = "";
        this.validate = (val) => {return typeof val === "string";};
        // update with any custom config given
        for (let key in config)
            this[key] = config[key];
    }

}

class NumberAttribute extends Attribute {

    constructor(config) {
        super(config);
        this.defaultValue = 0;
        this.validate = (val) => {return typeof val === "number";};
        // update with any custom config given
        for (let key in config)
            this[key] = config[key];
    }

}

class BooleanAttribute extends Attribute {

    constructor(config) {
        super(config);
        this.defaultValue = false;
        this.validate = (val) => {return typeof val === "boolean";};
        this.convertDbValue = (val) => {return val == 1 ? true : false;};
        // update with any custom config given
        for (let key in config)
            this[key] = config[key];
    }

}

class DateAttribute extends Attribute {
    
    constructor(config) {
        super(config);
        this.defaultValue = null;
        this.validate = (val) => {return typeof val.getMonth === 'function';};
        this.convertDbValue = (val) => {return new Date(val)};
        // update with any custom config given
        for (let key in config)
            this[key] = config[key];
    }

}

module.exports = {
    Model, 
    Attribute, 
    StringAttribute, 
    NumberAttribute, 
    BooleanAttribute,
    DateAttribute
}