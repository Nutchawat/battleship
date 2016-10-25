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

    // app.get('/deployships/:board_id', function(req, res, next) {
    //     promise = Board.find({brd_id: req.params.board_id}).exec();
    //     promise.then(function(player_board) {
    //         res.json(ship.deployShips(player_board));
    //     })
    //     .catch(function(err) {
    //         res.sendStatus(500);
    //     });
    // });
    // etc. /deployship/battleship/0/0@1 -> (0 = horizontal, 1 = vertical), (0@1 => x_index 0 and y_index 1)
    app.get('/deployship/:board_id/:shiptype/:land_index/:position_start', function(req, res, next) {
        promise = Board.find({brd_id: req.params.board_id}).exec();
        promise.then(function(player_board) {
            res.json(ship.deployShip(req.params.shiptype, req.params.land_index, req.params.position_start, player_board));
        })
        .catch(function(err) {
            res.sendStatus(500);
        });
    });

    // app.get('/attackships/:board_id', function(req, res, next) {
    //     promise = Board.find({brd_id: req.params.board_id}).exec();
    //     promise.then(function(enemy_board) {
    //         res.send(ship.attackShips(enemy_board));
    //     })
    //     .catch(function(err) {
    //         res.sendStatus(500);
    //     });
    // });

    app.get('/attackship/:board_id/:position', function(req, res, next) {
        promise = Board.find({brd_id: req.params.board_id}).exec();
        promise.then(function(enemy_board) {
            res.json(ship.attackShip(req.params.board_id, req.params.position, enemy_board));
        })
        .catch(function(err) {
            res.sendStatus(500);
        });
    });

    app.get('/resetships/:board_id', function(req, res, next) {
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
