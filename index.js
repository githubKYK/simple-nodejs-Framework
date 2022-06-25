var nodeWebSimple = require('./myFramework/nodeWebSimple');
var template = require('./myFramework/template');

template.setPath('./views/');

nodeWebSimple.use('/home', (req, res, next) => {
    template.render(res, 'home.html', {arr:["phung", "duc", "manh"]});
});

nodeWebSimple.use('/profile', (req, res, next) => {
    template.render(res, 'profile.html', {});
});

nodeWebSimple.run(3000);