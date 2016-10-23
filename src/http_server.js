var ship  = require('./ship_management');
var settings    = require('./settings');
var path = require('path');

module.exports.initialize = function(express, app, http, callback) {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {
        layout: false
    });

    // expose public resources
    app.use(express.static('./frontend/public'));

    app.get('/', function(req, res, next) {
        res.sendFile(path.resolve(__dirname + '/../frontend/start.html'));
    });

    app.get('/api', function(req, res, next) {
        res.render('index', {});
    });

    app.get('/deployships', function(req, res, next) {
        res.send(ship.deployShips());
    });

    app.get('/deployship/:shiptype', function(req, res, next) {
        res.send(ship.deployShip(req.params.shiptype));
    });

    app.get('/attackships', function(req, res, next) {
        res.send(ship.attackShips());
    });

    app.get('/reset', function(req, res, next) {
        res.send(ship.resetShips());
    });

    return http.listen(settings.PORT, callback);
};
