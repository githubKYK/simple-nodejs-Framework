const view = require('../views/control');
const data = require('../data/control');

class Home{
    home(param){
        if(param)
        return JSON.stringify(param);
        return "MY home";
    }
}
module.exports = new Home;