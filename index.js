const serverEngine = require('./engine/serverEngine');
const fs = require('fs');

serverEngine.set("static", "static/");

serverEngine.set("action", (req, res, next) => {
    let url = req.url;
    url = url.slice(1);
    url = url.split('/');
    let path = './controllers/' + url[0] + ".js";
    if(fs.existsSync(path)){
        url[0] = require(path);
        console.log(url);
        if(url[2]){
            url[2] = url[2].split("&");
            let params = url[2];
            let obj = {};
            let templ = params.length;
            for(let i = 0; i < templ; i++){
                params[i] = params[i].split("=");
                obj[params[i][0]] = params[i][1];
            }
            url[0][url[1]](req, res, next, obj);
        }
        else{
            url[0][url[1]](req, res, next);
        }
    }
});

serverEngine.run();