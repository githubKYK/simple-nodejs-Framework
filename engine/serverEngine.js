const http = require('http');
const fs = require('fs');

class ServerEngine{
    constructor(){
        this.port = 3000;
        this.static = "./statics/";
        this.action;
    }

    set(name, value){
        this[name] = value;
    }

    run(port){
        let serverStatic = this.static;
        let action = this.action;
        http.createServer((req, res, next) => {
            console.log(req.url);
            //check open static file
            let url = req.url;
            url = url.slice(url.indexOf(serverStatic));
            if(url.includes(serverStatic)){
                if(fs.existsSync(url)){
                    let staticContent = fs.readFileSync(url);
                    res.write(staticContent);
                }
            }
            action(req, res, next);
            res.end();
        }).listen(this.port);
    }
}

module.exports = new ServerEngine;