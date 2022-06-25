const view = require('../views/control');
const data = require('../data/control');

class Profile{
    default(req, res, next, param){
        //let data = data.homeData();
        view.render(res, 'profile', {});
    }
}
module.exports = new Profile;