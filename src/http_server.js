// Declare Mongo Model
var mongoose      = require('mongoose');
mongoose.Promise = global.Promise;

var settings      = require('./settings');
var User          = require('./models/user');
var Board         = require('./models/board');
var BoardHistory  = require('./models/board_history');

var ship  = require('./ship_management');
var settings    = require('./settings');
var path = require('path');

const PLAYER_BOARD_ID    = 1;

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
        promise = Board.find({brd_id: PLAYER_BOARD_ID}).exec();
        promise.then(function(player_board) {
            res.json(ship.deployShips(player_board));
        })
        .catch(function(err) {
            res.sendStatus(500);
        });
    });
    // etc. /deployship/battleship/0/0@1 -> (0 = horizontal, 1 = vertical), (0@1 => x_index 0 and y_index 1)
    app.get('/deployship/:shiptype/:land_index/:position_start', function(req, res, next) {
        promise = Board.find({brd_id: PLAYER_BOARD_ID}).exec();
        promise.then(function(player_board) {
            res.json(ship.deployShip(req.params.shiptype, req.params.land_index, req.params.position_start, player_board));
        })
        .catch(function(err) {
            res.sendStatus(500);
        });
    });

    app.get('/attackships/:enemy_id', function(req, res, next) {
        res.send(ship.attackShips(req.params.enemy_id));
    });

    app.get('/attackship/:enemy_id/:position', function(req, res, next) {
        res.send(ship.attackShip(req.params.enemy_id, req.params.position));
    });

    app.get('/reset/:board_id', function(req, res, next) {
        promise = Board.findOneAndRemove({brd_id: req.params.board_id}).exec();
        promise.then(function(board) {
            res.json(ship.resetShips()); 
        })
        .catch(function(err) {
            res.sendStatus(500);
        });
    });

    app.get('/board/:board_id', function(req, res, next) {
        promise = Board.find({brd_id: req.params.board_id}).exec();
        promise.then(function(board) {
            if(board.length == 0) {
                res.json(ship.initBoard());
            }else {
                res.json(JSON.parse(board[0].brd_state));
            }
        })
        .catch(function(err) {
            res.sendStatus(500);
        });
    });

    return http.listen(settings.PORT, callback);
};
