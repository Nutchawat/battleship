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

//Global Variables
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

module.exports.deployShips = function () {
    initGlobalVariable();
    for(var shiptype in SHIP_AMT) {
        for(var i=0; i<SHIP_AMT[shiptype]; i++) {
            deploy(shiptype);
        }
    }

    return rects;
}

module.exports.deployShip = function (shiptype) {
    deploy(shiptype);

    return rects;
}

module.exports.attackShips = function () {
    initAtkRects();
    shuffleAtkRects();
    for(atk_rect of atk_rects) {
        if(game_end) {
            break;
        }
        var i = atk_rect[0];
        var j = atk_rect[1];
        attack(i, j);
    }

    return rects;
}

module.exports.resetShips = function () {
    initGlobalVariable();

    return deployedship_amt;
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

var deploy = function (shiptype) {
    if(shiptype in SHIP_AMT) {
        initRects();
        if(deployedship_amt[shiptype] < SHIP_AMT[shiptype]) {
            var loop_count = 0;
            var valid = false;
            while(!valid && loop_count < MAX_LOOP){
                loop_count++;
                valid = validatedDeployment(shiptype);
            }
            if(valid) {
                deployedship_amt[shiptype]++;
            }
        }
        console.log(deployedship_amt);
    }else {
        console.log('unknown shiptype '+shiptype);
    }
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
    }

    if(JSON.stringify(sankship_amt) === JSON.stringify(SHIP_AMT)) {
        console.log('Game over, you win');
        game_end = true;
    }
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

var initAtkRects = function () {
    var index = 0;
    if(atk_rects.length == 0) {
        atk_rects = [];
        for(var i = 0; i < BOARD_SIZE; i++) {
          for(var j = 0; j < BOARD_SIZE; j++) {
            atk_rects[index] = [i,j];
            index++;
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

var validatedDeployment = function (shiptype) {
    var x_index    = Math.floor(Math.random() * BOARD_SIZE); // 0-(BOARD_SIZE-1)
    var y_index    = Math.floor(Math.random() * BOARD_SIZE); // 0-(BOARD_SIZE-1)
    var pos_from   = {x: x_index, y: y_index};
    var pos_to     = {x: x_index, y: y_index};
    var land_index = (Math.floor(Math.random() * 10) % 2);
    
    if(LAND[land_index] == 'horizontal') {
        pos_to.x = x_index + SHIP_SIZE[shiptype] - 1;
    }else if(LAND[land_index] == 'vertical') {
        pos_to.y = y_index + SHIP_SIZE[shiptype] - 1;
    }

    if(pos_to.x > (BOARD_SIZE - 1) || pos_to.y > (BOARD_SIZE - 1)) {
        console.log('out of range fail');
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
                console.log('diagonally adjacent fail');
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
    console.log('deployed success');

    return true;
}