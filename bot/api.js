const fetch = require('node-fetch');
const config = require('./config.json');

class API {

    constructor(){}

    async req(endpoint, method, body, json = true){
        let req_config = {
            headers: {
                token: this.apiToken
            },
            method: method
        }
        if (method !== 'GET' && body){
            req_config.body = JSON.stringify(body);
            req_config.headers['Content-Type'] = 'application/json';
        }
        return fetch(config.API + endpoint, req_config)
            .then(res => {
                if (!res.ok)
                    throw Error(res.status);
                if (json)
                    return res.json();
                return res.text();
            })
            .catch(err => {
                // need new token
                if (err === 401){
                    return this.auth().then(() => this.req(endpoint, method, body, json));
                }
                // acct credentials need right privilges
                else if (err === 403){
                    throw Error(err);
                }
                // something else??
                else{
                    throw Error(err);
                }
            });
    }

    token(){
        return this.apiToken;
    }

    async auth(){
        console.log('Authenticating bot...');
        return fetch(config.API+"/auth", {
                "headers": {
                    "user": config.API_USERNAME,
                    "password": config.API_PASSWORD
                }  
            })
            .then(response => response.text())
            .then(token => {
                console.log('Bot authenticated.\nToken: ' + token);
                this.apiToken = token;
            })
    }

}

module.exports = API;