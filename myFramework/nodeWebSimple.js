var http = require('http');
var url  = require('url');

function praseUrl(url){
    let arr = url.split('?');
    let path = arr[0];
    let query = {};
    if(arr.length > 1){
        path = arr[0];
        let search = arr[1];
        let arrSearch = search.split('&');
        let sl = arrSearch.length;
        query = {};
        for(let i = 0; i < sl; i++){
            let kv = arrSearch[i].split('=');
            query[kv[0]] = kv[1];
        }
    }

    return {
        path,
        query
    };

}

class NodeWebSimple{
    constructor(){
        this.routes = [];
    }

    use(path, method){
        this.routes.push({
            path: path,
            method: method
        });
    }

    run(port){
        var routes = this.routes;
        http.createServer(function(req, res, next) {
            console.log(req.text);
            var fullUrl = praseUrl(req.url);
            // console.log(routes);
            let routeLength = routes.length;
            let notFound = true;
            for(let i = 0; i < routeLength; i++){
                if(fullUrl.path == routes[i].path){
                    routes[i].method(req, res, next, fullUrl);
                    notFound = false;
                    break;
                }
            }
            if(notFound)
                res.end("NOT FOUND");
        }).listen(port);
        console.log("RUN");
    }
}

module.exports = new NodeWebSimple;

