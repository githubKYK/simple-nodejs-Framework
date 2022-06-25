const view = require('../views/control');
const data = require('../data/control');

class Home{
    home(req, res, next, param){
        if(param)
        res.write(JSON.stringify(param));
    }
}
module.exports = new Home;