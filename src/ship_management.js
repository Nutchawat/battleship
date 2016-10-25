var mongoose      = require('mongoose');
var settings      = require('./settings');
var User          = require('./models/user');
var Board         = require('./models/board');
var BoardHistory  = require('./models/board_history');

// // Constant Variables
const PLAYER_ID   = "0001";
const ENEMY_ID    = "0001"; //set "0001" same player_id for test deploy and attack itselfs
const PLAYER_BOARD_ID    = "brd001";
const ENEMY_BOARD_ID     = "brd001"; //set "brd001" same player_board_id for test deploy and attack itselfs
const SESSION_ID  = PLAYER_ID+'@'+PLAYER_BOARD_ID+'@@'+ENEMY_ID+'@'+ENEMY_BOARD_ID+'';
const WHITE_COLOR = '0'; //empty ship
const GREEN_COLOR = '1'; //deployed ship
const GREY_COLOR  = '2'; //attack on empty ship
const RED_COLOR   = '3'; //attack on deployed ship
const LAND        = ['horizontal', 'vertical'];
const BOARD_SIZE  = 10;
const MAX_LOOP    = Math.pow(BOARD_SIZE, 2);
const NO          = 'no';
const YES         = 'yes';
const BOARD_STATUS= {
    DEPLOY: "0",
    PLAY:   "1",
    FINISH: "2",
};
const DEPLOY_PROPS = {
    type       : 'board',
    attacked   : NO
};
const SHIP_SIZE   = {
    battleship : 4,
    cruiser    : 3,
    destroyer  : 2,
    submarine  : 1
};
const SHIP_AMT    = {
    battleship : 1,
    cruiser    : 2,
    destroyer  : 3,
    submarine  : 4
};
const SHIP_START = {
    battleship : 0,
    cruiser    : 0,
    destroyer  : 0,
    submarine  : 0  
};
const STATUS = {
    DEPLOYSUCCESS:  ["DS", "deployed success"],
    OVERLIMIT:      ["OL", "overlimited to deploy fail"],
    NOSHIPTYPE:     ["NT", "unknown shiptype fail"],
    NOLAND:         ["NL", "parameter is not both in horizontal and vertical fail"],
    OUTOFRANGE:     ["OR", "ship out of range fail"],
    ADJACENT:       ["AJ", "diagonally adjacent fail"],
    WRONGTYPE:      ["WT", "wrong value type or index out of range fail"],
    MAXLOOP:        ["ML", "loop max fail"],

    RESETSUCCESS:   ["RS", "reset the game success"],

    GAMENOTREADY:   ["GN","Game is not ready"],
    ATTACKSAMEPOS:  ["AS","Cannot attack at the same position'"],
    MISS:           ["MI","Miss"],
    HIT:            ["HT","Hit"],
    SANK:           ["SK","You just sank the ship"],
    WIN:            ["WN","Game over, you win"]
};

// module.exports.deployShips = function (player_board) {
//     var x_index;
//     var y_index;
//     var land_index;
//     var state;
//     var backup_status_state;
//     for(var shiptype in SHIP_AMT) {
//         for(var i=0; i<SHIP_AMT[shiptype]; i++) {
//             while(backup_status_state != STATUS.DEPLOYSUCCESS[0]) {
//                 x_index    = Math.floor(Math.random() * BOARD_SIZE); // 0-(BOARD_SIZE-1)
//                 y_index    = Math.floor(Math.random() * BOARD_SIZE); // 0-(BOARD_SIZE-1)
//                 land_index = (Math.floor(Math.random() * 10) % 2);
//                 state = deploy(shiptype, land_index, x_index, y_index, player_board);
//                 backup_status_state = state.status.code;
//             }
//             backup_status_state = "";
//         }
//     }
//     return Response(state);
// }

module.exports.deployShip = function (shiptype, land_index, position_start, player_board) {
    var state = {};
    var arr_position = position_start.split("@");
    var x_index = +(arr_position[0]);
    var y_index = +(arr_position[1]);
    state = deploy(shiptype, land_index, x_index, y_index, player_board);

    return Response(state);
}

// module.exports.attackShips = function (enemy_board_id) {
//     var state = {};
//     if(rects.length > 0) {
//         var atk_rects = initAtkRects();
//         var x_index;
//         var y_index;
//         for(atk_rect of atk_rects) {
//             x_index = +(atk_rect[0]);
//             y_index = +(atk_rect[1]);
//             if((x_index >= 0 && x_index < BOARD_SIZE) && (y_index >= 0 && y_index < BOARD_SIZE)) {
//                 state = attack(enemy_board_id, x_index, y_index);
//             }else {
//                 state.status = setStateStatus(STATUS.WRONGTYPE);
//             }
//         }
//     }else {
//         state.status = setStateStatus(STATUS.GAMENOTREADY);
//     }
//     return Response(state);
// }

module.exports.attackShip = function (enemy_board_id, position, enemy_board) {
    var state = {};
    if(enemy_board.length > 0) {
        if(enemy_board[0].brd_sank_amt === JSON.stringify(SHIP_AMT)) {
            var arr_position = position.split("@");
            var x_index = +(arr_position[0]);
            var y_index = +(arr_position[1]);
            
            if((x_index >= 0 && x_index < BOARD_SIZE) && (y_index >= 0 && y_index < BOARD_SIZE)) {
                state = attack(enemy_board_id, x_index, y_index, enemy_board);
            }else {
                state.status = setStateStatus(STATUS.WRONGTYPE);
            }
        }else{
            state.status = setStateStatus(STATUS.GAMENOTREADY);
        }
    }else {
        state.status = setStateStatus(STATUS.GAMENOTREADY);
    }

    return Response(state);
}

module.exports.resetShips = function () {
    var state = {}
    state.status = setStateStatus(STATUS.RESETSUCCESS);

    return Response(state);
}

module.exports.initBoard = function () {
    var obj_rects = initRectsAndDeployRects();

    return obj_rects.rects;
}

var deploy = function (shiptype, land_index, x_index, y_index, player_board) {
    var state  = {}
    state.detail = setDeploymentStateDetail(shiptype, land_index, x_index, y_index);

    var deployedship_amt;
    if(player_board.length == 0) {
        deployedship_amt = JSON.parse(JSON.stringify(SHIP_START));
    }else {
        deployedship_amt = JSON.parse(player_board[0].brd_depl_amt);
    }
    
    if(shiptype in SHIP_AMT) {
        if(deployedship_amt[shiptype] < SHIP_AMT[shiptype]) {
            validate = validatedDeployment(shiptype, land_index, x_index, y_index, player_board, deployedship_amt);
            if(validate.bool) {
                state.ship_count = validate.ship_count;
            }
            state.status     = validate.status;
        }else{
            state.status = setStateStatus(STATUS.OVERLIMIT);
        }
    }else {
        state.status = setStateStatus(STATUS.NOSHIPTYPE);
    }

    return state;
}

var attack = function (enemy_board_id, i, j, enemy_board) {
    var state = {}
    var rects            = JSON.parse(enemy_board[0].brd_state);
    var deploy_rects     = JSON.parse(enemy_board[0].brd_depl_state);
    var sankship_amt     = JSON.parse(enemy_board[0].brd_sank_amt);
    var board_status     = BOARD_STATUS.PLAY;
    state.detail = setAttackStateDetail(enemy_board_id, i, j);
    if(rects[i][j] == WHITE_COLOR) {  
        state.status = setStateStatus(STATUS.MISS);
        rects[i][j] = GREY_COLOR;
    }else if(rects[i][j] == GREEN_COLOR) {
        rects[i][j] = RED_COLOR;
        deploy_rects[i][j].attacked = YES;
        validate = validateShipsank(i,j,deploy_rects);
        deploy_rects = validate.deploy_rects;
        if(!validate.bool) {
            state.status = setStateStatus(STATUS.HIT);
        }else {
            state.status = setStateStatus(STATUS.SANK);
            sankship_amt[deploy_rects[i][j].type]++;
        }
    }else {
        state.status = setStateStatus(STATUS.ATTACKSAMEPOS);
    }

    if(JSON.stringify(sankship_amt) === JSON.stringify(SHIP_AMT)) {
        state.status = setStateStatus(STATUS.WIN);
        board_status = BOARD_STATUS.FINISH;
    }

    enemy_board[0].brd_trn_id = ENEMY_ID;
    enemy_board[0].brd_state = JSON.stringify(rects);
    enemy_board[0].brd_depl_state = JSON.stringify(deploy_rects);
    enemy_board[0].brd_sank_amt = JSON.stringify(sankship_amt);
    enemy_board[0].brd_status = board_status;
    enemy_board[0].save(function(err) {
        if (err) throw err;
        // console.log('update enemy board success');
    });

    Board.find({ brd_id: PLAYER_BOARD_ID }, function(err, player_board){
        player_board[0].brd_trn_id = ENEMY_ID;
        player_board[0].brd_status = board_status;
        player_board[0].save(function(err) {
            if(err) throw err;
            // console.log('update player board success');
        });
    });
    return state;
}

var validatedDeployment = function (shiptype, land_index, x_index, y_index, player_board, deployedship_amt) {
    var state = {};
    if( (x_index >=0 && x_index < BOARD_SIZE) && 
        (y_index >=0 && y_index < BOARD_SIZE) && 
        (land_index == 0 || land_index == 1)) {
        var pos_from   = {x: x_index, y: y_index};
        var pos_to     = {x: x_index, y: y_index};
      
        if(LAND[land_index] == 'horizontal') {
            pos_to.x = x_index + SHIP_SIZE[shiptype] - 1;
        }else if(LAND[land_index] == 'vertical') {
            pos_to.y = y_index + SHIP_SIZE[shiptype] - 1;
        }else {
            return { status: setStateStatus(STATUS.NOLAND), bool: false };
        }

        if(pos_to.x > (BOARD_SIZE - 1) || pos_to.y > (BOARD_SIZE - 1)) {
            return { status: setStateStatus(STATUS.OUTOFRANGE), bool: false };
        }

        // validate diagonally adjacent 
        var i_from = (pos_from.x - 1 >= 0) ? pos_from.x - 1 : 0;
        var j_from = (pos_from.y - 1 >= 0) ? pos_from.y - 1 : 0;

        var i_to   = (pos_to.x + 1 < (BOARD_SIZE - 1)) ? pos_to.x + 1 : (BOARD_SIZE - 1);
        var j_to   = (pos_to.y + 1 < (BOARD_SIZE - 1)) ? pos_to.y + 1 : (BOARD_SIZE - 1);

        var rects = [];
        var deploy_rects = [];
        if(player_board.length == 0) {
            var obj_rects    = initRectsAndDeployRects();
            rects            = obj_rects.rects;
            deploy_rects     = obj_rects.deploy_rects;
        }else{
            rects            = JSON.parse(player_board[0].brd_state);
            deploy_rects     = JSON.parse(player_board[0].brd_depl_state);
        }

        for(var i=i_from; i<=i_to; i++) {
            for(var j=j_from; j<=j_to; j++) {
                if(rects[i][j] == GREEN_COLOR) {
                    return { status: setStateStatus(STATUS.ADJACENT), bool: false };
                }
            }
        }

        // set deploy ship from pos_from and pos_to to rects position
        for(var i=pos_from.x; i<=pos_to.x; i++) {
            for(var j=pos_from.y; j<=pos_to.y; j++) {
                rects[i][j] = GREEN_COLOR;
                deploy_rects[i][j].type = shiptype;
                deploy_rects[i][j].attacked = NO;
                deploy_rects[i][j].pos_from = pos_from;
                deploy_rects[i][j].pos_to   = pos_to;
            }
        }
        deployedship_amt[shiptype]++;

        if(player_board.length == 0) {
            player_board = new Board({
                brd_id:         PLAYER_BOARD_ID,
                brd_usr_id:     PLAYER_ID,
                brd_session_id: SESSION_ID,
                brd_trn_id:     PLAYER_ID,
                brd_state:      JSON.stringify(rects),
                brd_depl_state: JSON.stringify(deploy_rects),
                brd_depl_amt:   JSON.stringify(deployedship_amt),
                brd_sank_amt:   JSON.stringify(SHIP_START),
                brd_status:     BOARD_STATUS.DEPLOY
            }); 
            player_board.save(function(err) {
                if (err) throw err;
                // console.log('insert success');
            });
        }else { 
            player_board[0].brd_state = JSON.stringify(rects);
            player_board[0].brd_depl_state = JSON.stringify(deploy_rects);
            player_board[0].brd_depl_amt = JSON.stringify(deployedship_amt);
            player_board[0].save(function(err) {
                if (err) throw err;
                // console.log('update success');
            });
        }
    }else {
        return { status: setStateStatus(STATUS.WRONGTYPE), bool: false };
    }
    return { 
        status: setStateStatus(STATUS.DEPLOYSUCCESS),
        ship_count: setDeploymentStateShipCount(JSON.stringify(deployedship_amt)),
        bool: true 
    };
}

var validateShipsank = function (i, j, _deploy_rects) {
    if(_deploy_rects[i][j].type != 'board') {
        for(var k = _deploy_rects[i][j].pos_from.x; k <= _deploy_rects[i][j].pos_to.x; k++) {
            for(var l = _deploy_rects[i][j].pos_from.y; l <= _deploy_rects[i][j].pos_to.y; l++) {
                if(_deploy_rects[k][l].attacked == NO) {
                    return { deploy_rects: _deploy_rects, bool: false };
                }
            }
        }
        return { deploy_rects: _deploy_rects, bool: true };
    }
    return { deploy_rects: _deploy_rects, bool: false };
}

var initRectsAndDeployRects = function () {
    var _rects = [];
    var _deploy_rects = [];
    for(var i = 0; i < BOARD_SIZE; i++) {
        _rects[i] = new Array(BOARD_SIZE);
        _deploy_rects[i] = new Array(BOARD_SIZE);
        for(var j = 0; j < BOARD_SIZE; j++) {
            _rects[i][j] = WHITE_COLOR;
            _deploy_rects[i][j] = DEPLOY_PROPS;
        }
    }

    return {rects : _rects, deploy_rects: _deploy_rects};
};

var initAtkRects = function () {
    var index = 0;
    var atk_rects = [];
    for(var i = 0; i < BOARD_SIZE; i++) {
      for(var j = 0; j < BOARD_SIZE; j++) {
        atk_rects[index] = [i,j];
        index++;
      }
    }

    var k, l;
    for (var i = atk_rects.length; i; i--) {
        k = Math.floor(Math.random() * i);
        l = atk_rects[i - 1];
        atk_rects[i - 1] = atk_rects[k];
        atk_rects[k] = l;
    }

    return atk_rects;
};

//Deploy
var setDeploymentStateDetail = function (shiptype, land_index, x_index, y_index) {
    var detail = {};
    detail.shiptype          = shiptype;
    detail.shipsize          = SHIP_SIZE[shiptype];
    detail.land_code         = land_index;
    detail.land_type         = LAND[land_index];
    detail.position_start_x  = x_index;
    detail.position_start_y  = y_index;

    return detail;
}
var setDeploymentStateShipCount = function(deployedship_amt_str) {
    var ship_count        = JSON.parse(deployedship_amt_str);

    return ship_count;
}

//Attack
var setAttackStateDetail = function (board_id, x_index, y_index) {
    var detail = {};
    detail.board_id          = board_id;
    detail.position_attack_x = x_index;
    detail.position_attack_y = y_index;

    return detail;
}

//Centralize
var setStateStatus = function (arr_status) {
    var status = {}
    status.code         = arr_status[0];
    status.detail       = arr_status[1];

    return status;
}

var Response = function (state) {
    var user = {
        id: PLAYER_ID,
        state: state
    };

    return {
        user : user
    }
}