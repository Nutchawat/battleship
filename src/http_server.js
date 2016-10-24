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
    // etc. /deployship/battleship/0/0@1 -> (0 = horizontal, 1 = vertical), (0@1 => x_index 0 and y_index 1)
    app.get('/deployship/:shiptype/:land_index/:position_start', function(req, res, next) {
        res.send(ship.deployShip(req.params.shiptype, req.params.land_index, req.params.position_start));
    });

    app.get('/attackships/:enemy_id', function(req, res, next) {
        res.send(ship.attackShips(req.params.enemy_id));
    });

    app.get('/attackship/:enemy_id/:position', function(req, res, next) {
        res.send(ship.attackShip(req.params.enemy_id, req.params.position));
    });

    app.get('/reset', function(req, res, next) {
        res.send(ship.resetShips());
    });

    return http.listen(settings.PORT, callback);
};
