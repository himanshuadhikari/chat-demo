module.exports = function(app, express) {
    var path = require('path');
    var url = __dirname + '/../';


    app.get('/', function(req, res) {
        res.render(url + '/app/index.html');
    });

    return module.exports;

}
