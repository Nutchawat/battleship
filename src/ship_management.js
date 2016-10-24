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
    SUCCESS:    ["SS", "deployed success"],
    OVERLIMIT:  ["OL", "overlimited to deploy fail"],
    NOSHIPTYPE: ["NS", "unknown shiptype fail"],
    NOLAND:     ["NL", "parameter is not both in horizontal and vertical fail"],
    OUTOFRANGE: ["OR", "ship out of range fail"],
    ADJACENT:   ["AJ", "diagonally adjacent fail"],
    WRONGTYPE:  ["WT", "wrong value type or index out of range fail"],
    MAXLOOP:    ["ML", "loop max fail"]
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
var responses = {};
var user = {
    id: "0001",
    name: "BOT",
    deployments: []
};
var deployment = {
    status: {},
    detail:{}
};

module.exports.deployShips = function () {
    initGlobalVariable();
    initResponseVariable();

    var x_index;
    var y_index;
    var land_index;
    for(var shiptype in SHIP_AMT) {
        for(var i=0; i<SHIP_AMT[shiptype]; i++) {
            while(deployment.status.code != STATUS.SUCCESS[0]) {
                x_index    = Math.floor(Math.random() * BOARD_SIZE); // 0-(BOARD_SIZE-1)
                y_index    = Math.floor(Math.random() * BOARD_SIZE); // 0-(BOARD_SIZE-1)
                land_index = (Math.floor(Math.random() * 10) % 2);
                deploy(shiptype, land_index, x_index, y_index);
            }
            deployment = {
                status: {},
                detail:{}
            };
        }
    }

    responses.user  = user;
    responses.board = rects;

    return responses;
}

module.exports.deployShip = function (shiptype, land_index, position_start) {
    var arr_position = position_start.split("@");
    var x_index = +(arr_position[0]);
    var y_index = +(arr_position[1]);
    deploy(shiptype, land_index, x_index, y_index);

    responses.user  = user;
    responses.board = rects;

    return responses;
}

module.exports.attackShips = function () {
    if(rects.length > 0) {
        initAtkRects();
        shuffleAtkRects();
        var x_index;
        var y_index;
        for(atk_rect of atk_rects) {
            if(game_end) {
                break;
            }
            x_index = atk_rect[0];
            y_index = atk_rect[1];
            attack(x_index, y_index);
        }
    }else {
        console.log('Game is not ready');
    }
    return rects;
}

module.exports.attackShip = function (position) {
    if(rects.length > 0) {
        var arr_position = position.split("@");
        var x_index = arr_position[0];
        var y_index = arr_position[1];
        attack(x_index, y_index);
    }else {
        console.log('Game is not ready');
    }
    
    return rects;
}

module.exports.resetShips = function () {
    initGlobalVariable();
    initResponseVariable();

    responses.user  = user;
    responses.board = rects;
    return responses;
}

var deploy = function (shiptype, land_index, x_index, y_index) {
    initResponseDeploymentVariable();
    setResponseDeploymentDetail(shiptype, land_index, x_index, y_index);
    if(shiptype in SHIP_AMT) {
        initRects();
        if(deployedship_amt[shiptype] < SHIP_AMT[shiptype]) {
            if(validatedDeployment(shiptype, land_index, x_index, y_index)) {
                deployedship_amt[shiptype]++;
                // console.log(deployedship_amt);
                setResponseDeploymentStatus(STATUS.SUCCESS);
                setResponseDeploymentShipCount(JSON.stringify(deployedship_amt));
            }
        }else{
            setResponseDeploymentStatus(STATUS.OVERLIMIT);
        }
    }else {
        setResponseDeploymentStatus(STATUS.NOSHIPTYPE);
    }
    setResponseUserDeployment();
}

var attack = function (i, j) {    
    if(rects[i][j] == WHITE_COLOR) {  
        console.log('Miss on postion ['+i+', '+j+'].');
        rects[i][j] = GREY_COLOR;
    }else if(rects[i][j] == GREEN_COLOR) {
        rects[i][j] = RED_COLOR;
        deploy_rects[i][j].attacked = YES;
        if(!validateShipsank(i,j)) {
            console.log('Hit on postion ['+i+', '+j+'].');
        }else {
            console.log('You just sank the '+deploy_rects[i][j].type+' from postion ['+deploy_rects[i][j].pos_from.x+', '+deploy_rects[i][j].pos_from.y+'], to postion ['+deploy_rects[i][j].pos_to.x+', '+deploy_rects[i][j].pos_to.y+'].');
            sankship_amt[deploy_rects[i][j].type]++;
        }
    }else {
        console.log('Cannot attack at the same position');
    }

    if(JSON.stringify(sankship_amt) === JSON.stringify(SHIP_AMT)) {
        console.log('Game over, you win');
        game_end = true;
    }
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
            setResponseDeploymentStatus(STATUS.NOLAND);
            return false;
        }

        if(pos_to.x > (BOARD_SIZE - 1) || pos_to.y > (BOARD_SIZE - 1)) {
            setResponseDeploymentStatus(STATUS.OUTOFRANGE);
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
                    setResponseDeploymentStatus(STATUS.ADJACENT);
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
        setResponseDeploymentStatus(STATUS.WRONGTYPE);
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

var initGlobalVariable = function () {
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

var initResponseVariable = function () {
    responses = {};
    user = {
        id: "0001",
        name: "BOT",
        deployments: []
    };
    initResponseDeploymentVariable();
}

var initResponseDeploymentVariable = function () {
    deployment = {
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

var setResponseDeploymentDetail = function (shiptype, land_index, x_index, y_index) {
    deployment.detail.shiptype          = shiptype;
    deployment.detail.shipsize          = SHIP_SIZE[shiptype];
    deployment.detail.land_code         = land_index;
    deployment.detail.land_type         = LAND[land_index];
    deployment.detail.position_start_x  = x_index;
    deployment.detail.position_start_y  = y_index;
}

var setResponseDeploymentStatus = function (arr_status) {
    deployment.status.code       = arr_status[0];
    deployment.status.detail     = arr_status[1];
}

var setResponseDeploymentShipCount = function(deployedship_amt_str) {
    deployment.ship_count        = JSON.parse(deployedship_amt_str);
}

var setResponseUserDeployment = function () {
    user.deployments.push(deployment);
}