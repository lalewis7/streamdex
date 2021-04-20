/**
 * Model parent does automatic validation of data given attribute configuration from getAttributeConfig().
 */
module.exports = {
    Model: class Model {
        constructor(attr, data){
            attr.map(a => {
                this[a.name] = a;
                if (data && data[a.name])
                    this[a.name].value = data[a.name];
                else
                    this[a.name].value = a.def;
            });
        }

        /**
         * Edit the model while not overriding uneditable data or data that is admin protected without correct priv
         * @param {Object} data new data
         * @param {Boolean} admin user admin status
         */
        edit(data, admin){
            for (let key in data){
                let attr = this[key];
                // if attribute exists
                // and the attribute can be edited
                // and if it's admin protected user has admin priv
                if (data && attr && attr.edit && (!attr.admin || (admin && attr.admin))){
                    this[key].value = data[key];
                }
            }
        }

        /**
         * Edits the data of the model regardless of editable and admin settings.
         * @param {Object} data new data
         */
        forceEdit(data){
            for (let key in data){
                if (this[key])
                    this[key].value = data[key];
            }
        }

        /**
         * Gets a viewable version of the data that can be sent to the user.
         */
        getViewable(){
            var data = {};
            for (let key in this){
                if (this[key].visible)
                    data[key] = this[key].value;
            }
            return data;
        }

        /**
         * Gets all data (should not be sent to user may contain unviewable data).
         */
        get(){
            var data = {};
            for (let key in this){
                data[key] = this[key].value;
            }
            return data;
        }
    },
    
    /**
     * Creates and attribute config variable used in Model constructor.
     * @param {String} name name of the attribute.
     * @param {Boolean} editable can the attribute be edited in put calls.
     * @param {Boolean} visible is the attribute visible in get calls.
     * @param {Boolean} admin_protected does the user require admin privelege to edit.
     * @param {Object} default_value the default value if one is not provided or does not priviliege to set.
     */
    getAttributeConfig(name, editable, visible, admin_protected, default_value){
        return {name: name, edit: editable, visible: visible, admin: admin_protected, def: default_value};
    }
}