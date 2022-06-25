const view = require('../views/control');
const data = require('../data/control');

class Home{
    home(req, res, next, param){
        //let data = data.homeData();
        view.render(res, 'home', {});
    }
}
module.exports = new Home;