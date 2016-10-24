// Constant Variables
const BOARD_SIZE  = 10;
const WHITE_COLOR = '0'; //empty ship
const GREEN_COLOR = '1'; //deployed ship
const GREY_COLOR  = '2'; //attack on empty ship
const RED_COLOR   = '3'; //attack on deployed ship
const LAND        = ['horizontal', 'vertical'];
const MAX_LOOP    = Math.pow(BOARD_SIZE, 2);
const NO          = 'no';
const YES         = 'yes';
const SHIP_SIZE   = {
    battleship : 4,
    cruiser    : 3,
    destroyer  : 2,
    submarine  : 1
};
const DEPLOY_PROPS = {
    type       : 'board',
    attacked   : NO
};
const SHIP_AMT    = {
    battleship : 1,
    cruiser    : 2,
    destroyer  : 3,
    submarine  : 4
}
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
const STATE = {
    DEPLOY_STATE: "deploy_state",
    ATTACK_STATE: "attack_state",
    RESET_STATE:  "reset_state"
};

//Global Variables
var round = 0;
var pos_from    = {};
var pos_to      = {};
var rects       = [];
var atk_rects   = [];
var deploy_rects= [];
var game_end    = false;
var deployedship_amt = {
    battleship : 0,
    cruiser    : 0,
    destroyer  : 0,
    submarine  : 0
};
var sankship_amt = {
    battleship : 0,
    cruiser    : 0,
    destroyer  : 0,
    submarine  : 0
};

//Response Variables
var backup_status_state = "";
var player = {
    id: "0001",
    name: "BOT1"
};
var enemy = {
    id: "0002",
    name: "BOT2"
};
var response = {
    result : {}
};
var user = {
    id: player.id,
    name: player.name,
    deploy_state: [],
    attack_state: [],
    reset_state: []

};
var state = {
    status: {},
    detail:{}
};

module.exports.deployShips = function () {
    clearGlobalVariable();
    clearResponseVariable();

    var x_index;
    var y_index;
    var land_index;
    for(var shiptype in SHIP_AMT) {
        for(var i=0; i<SHIP_AMT[shiptype]; i++) {
            while(backup_status_state != STATUS.DEPLOYSUCCESS[0]) {
                x_index    = Math.floor(Math.random() * BOARD_SIZE); // 0-(BOARD_SIZE-1)
                y_index    = Math.floor(Math.random() * BOARD_SIZE); // 0-(BOARD_SIZE-1)
                land_index = (Math.floor(Math.random() * 10) % 2);
                deploy(shiptype, land_index, x_index, y_index);
            }
            backup_status_state = "";
        }
    }

    setResponse();

    return response;
}

module.exports.deployShip = function (shiptype, land_index, position_start) {
    var arr_position = position_start.split("@");
    var x_index = +(arr_position[0]);
    var y_index = +(arr_position[1]);
    deploy(shiptype, land_index, x_index, y_index);
    setResponse();

    return response;
}

module.exports.attackShips = function (enemy_id) {
    if(rects.length > 0) {
        initAtkRects();
        shuffleAtkRects();
        var x_index;
        var y_index;
        for(atk_rect of atk_rects) {
            if(game_end) {
                break;
            }
            x_index = +(atk_rect[0]);
            y_index = +(atk_rect[1]);
            attack(enemy_id, x_index, y_index);
        }
    }else {
        setStateStatus(STATUS.GAMENOTREADY);
        setResponseUser(STATE.ATTACK_STATE);
    }
    setResponse();

    return response;
}

module.exports.attackShip = function (enemy_id, position) {
    if(rects.length > 0) {
        var arr_position = position.split("@");
        var x_index = +(arr_position[0]);
        var y_index = +(arr_position[1]);
        attack(enemy_id, x_index, y_index);
    }else {
        setStateStatus(STATUS.GAMENOTREADY);
        setResponseUser(STATE.ATTACK_STATE);
    }
    setResponse();

    return response;
}

module.exports.resetShips = function () {
    clearGlobalVariable();
    clearResponseVariable();
    setStateStatus(STATUS.RESETSUCCESS);
    setResponseUser(STATE.RESET_STATE);
    setResponse();
    return response;
}

var deploy = function (shiptype, land_index, x_index, y_index) {
    setDeploymentStateDetail(shiptype, land_index, x_index, y_index);
    if(shiptype in SHIP_AMT) {
        initRects();
        if(deployedship_amt[shiptype] < SHIP_AMT[shiptype]) {
            if(validatedDeployment(shiptype, land_index, x_index, y_index)) {
                deployedship_amt[shiptype]++;
                setStateStatus(STATUS.DEPLOYSUCCESS);
                setDeploymentStateShipCount(JSON.stringify(deployedship_amt));
            }
        }else{
            setStateStatus(STATUS.OVERLIMIT);
        }
    }else {
        setStateStatus(STATUS.NOSHIPTYPE);
    }
    setResponseUser(STATE.DEPLOY_STATE);
}

var attack = function (enemy_id, i, j) {
    setAttackStateDetail(enemy_id, i, j);
    if(rects[i][j] == WHITE_COLOR) {  
        setStateStatus(STATUS.MISS);
        // console.log('Miss on postion ['+i+', '+j+'].');
        rects[i][j] = GREY_COLOR;
    }else if(rects[i][j] == GREEN_COLOR) {
        rects[i][j] = RED_COLOR;
        deploy_rects[i][j].attacked = YES;
        if(!validateShipsank(i,j)) {
            setStateStatus(STATUS.HIT);
            // console.log('Hit on postion ['+i+', '+j+'].');
        }else {
            setStateStatus(STATUS.SANK);
            // console.log('You just sank the '+deploy_rects[i][j].type+' from postion ['+deploy_rects[i][j].pos_from.x+', '+deploy_rects[i][j].pos_from.y+'], to postion ['+deploy_rects[i][j].pos_to.x+', '+deploy_rects[i][j].pos_to.y+'].');
            sankship_amt[deploy_rects[i][j].type]++;
        }
    }else {
        setStateStatus(STATUS.ATTACKSAMEPOS);
    }

    if(JSON.stringify(sankship_amt) === JSON.stringify(SHIP_AMT)) {
        setStateStatus(STATUS.WIN);
        game_end = true;
    }
    setResponseUser(STATE.ATTACK_STATE);
}

var validatedDeployment = function (shiptype, land_index, x_index, y_index) {
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
            setStateStatus(STATUS.NOLAND);
            return false;
        }

        if(pos_to.x > (BOARD_SIZE - 1) || pos_to.y > (BOARD_SIZE - 1)) {
            setStateStatus(STATUS.OUTOFRANGE);
            return false;
        }

        // validate diagonally adjacent 
        var i_from = (pos_from.x - 1 >= 0) ? pos_from.x - 1 : 0;
        var j_from = (pos_from.y - 1 >= 0) ? pos_from.y - 1 : 0;

        var i_to   = (pos_to.x + 1 < (BOARD_SIZE - 1)) ? pos_to.x + 1 : (BOARD_SIZE - 1);
        var j_to   = (pos_to.y + 1 < (BOARD_SIZE - 1)) ? pos_to.y + 1 : (BOARD_SIZE - 1);
        
        for(var i=i_from; i<=i_to; i++) {
            for(var j=j_from; j<=j_to; j++) {
                if(rects[i][j] == GREEN_COLOR) {
                    setStateStatus(STATUS.ADJACENT);
                    return false;
                }
            }
        }

        // set deploy ship from pos_from and pos_to to rects position
        for(var i=pos_from.x; i<=pos_to.x; i++) {
            for(var j=pos_from.y; j<=pos_to.y; j++) {
                rects[i][j] = GREEN_COLOR;
                deploy_rects[i][j] = {
                    type : shiptype,
                    attacked : NO,
                    pos_from : pos_from,
                    pos_to   : pos_to
                };
            }
        }
    }else {
        setStateStatus(STATUS.WRONGTYPE);
        return false;
    }

    return true;
}

var validateShipsank = function (i, j) {
    if(deploy_rects[i][j].type != 'board') {
        for(var k = deploy_rects[i][j].pos_from.x; k <= deploy_rects[i][j].pos_to.x; k++) {
            for(var l = deploy_rects[i][j].pos_from.y; l <= deploy_rects[i][j].pos_to.y; l++) {
                if(deploy_rects[k][l].attacked == NO) {
                    return false;
                }
            }
        }
        return true;
    }
    return false;
}

var clearGlobalVariable = function () {
    pos_from    = {};
    pos_to      = {};
    rects       = [];
    atk_rects   = [];
    deploy_rects= [];
    game_end    = false;
    deployedship_amt = {
        battleship : 0,
        cruiser    : 0,
        destroyer  : 0,
        submarine  : 0
    }
    sankship_amt = {
        battleship : 0,
        cruiser    : 0,
        destroyer  : 0,
        submarine  : 0
    };
}

var clearResponseVariable = function () {
    response = {
        result : {}
    };
    user = {
        id: player.id,
        name: player.name,
        deploy_state: [],
        attack_state: [],
        reset_state: []
    };
    clearStateVariable();
}

var clearStateVariable = function () {
    state = {
        status: {},
        detail:{}
    }; 
}

var initAtkRects = function () {
    if(atk_rects.length == 0) {
        var index = 0;
        atk_rects = [];
        for(var i = 0; i < BOARD_SIZE; i++) {
          for(var j = 0; j < BOARD_SIZE; j++) {
            atk_rects[index] = [i,j];
            index++;
          }
        }
    }
};

var initRects = function () {
    if(rects.length == 0) {
        rects = new Array(BOARD_SIZE);
        for(var i = 0; i < BOARD_SIZE; i++) {
          rects[i] = new Array(BOARD_SIZE);
          deploy_rects[i] = new Array(BOARD_SIZE);
          for(var j = 0; j < BOARD_SIZE; j++) {
            rects[i][j] = WHITE_COLOR;
            deploy_rects[i][j] = DEPLOY_PROPS;
          }
        }
    }
};

var shuffleAtkRects = function () {
    var j, x, i;
    for (i = atk_rects.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = atk_rects[i - 1];
        atk_rects[i - 1] = atk_rects[j];
        atk_rects[j] = x;
    }
}

//Deploy
var setDeploymentStateDetail = function (shiptype, land_index, x_index, y_index) {
    state.detail.shiptype          = shiptype;
    state.detail.shipsize          = SHIP_SIZE[shiptype];
    state.detail.land_code         = land_index;
    state.detail.land_type         = LAND[land_index];
    state.detail.position_start_x  = x_index;
    state.detail.position_start_y  = y_index;
}
var setDeploymentStateShipCount = function(deployedship_amt_str) {
    state.ship_count        = JSON.parse(deployedship_amt_str);
}

//Attack
var setAttackStateDetail = function (enemy_id, x_index, y_index) {
    state.detail.enemy_id          = enemy_id;
    state.detail.position_attack_x = x_index;
    state.detail.position_attack_y = y_index;
}

//Centralize
var setStateStatus = function (arr_status) {
    state.status.code       = arr_status[0];
    state.status.detail     = arr_status[1];
    backup_status_state     = state.status.code; //now it only use in deployships
}

var setResponseUser = function (state_name) {
    user[state_name].push(state);
    clearStateVariable();
}

var setResponse = function () {
    response.result.user  = user;
    response.result.board = rects;
}