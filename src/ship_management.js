// Constant Variables
const BOARD_SIZE  = 10;
const WHITE_COLOR = '0'; //empty ship
const GREEN_COLOR = '1'; //deployed ship
const GREY_COLOR  = '2'; //attack on empty ship
const RED_COLOR   = '3'; //attack on deployed ship
const LAND        = ['horizontal', 'vertical'];
const MAX_LOOP    = Math.pow(BOARD_SIZE, 2);
const SHIP_SIZE   = {
    battleship : 4,
    cruiser    : 3,
    destroyer  : 2,
    submarine  : 1
}
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
var deployedship_amt = {
    battleship : 0,
    cruiser    : 0,
    destroyer  : 0,
    submarine  : 0
}
var sankship_amt = {
    battleship : 0,
    cruiser    : 0,
    destroyer  : 0,
    submarine  : 0
}

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

module.exports.attackShip = function () {
    // attack();

    return 'coming soon...';
}

module.exports.resetShips = function () {
    initGlobalVariable();

    return 'Ships were reseted';
}

var initGlobalVariable = function () {
    pos_from    = {};
    pos_to      = {};
    rects       = [];
    deployedship_amt = {
        battleship : 0,
        cruiser    : 0,
        destroyer  : 0,
        submarine  : 0
    }
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

// var attack = function (i, j) {    
//     if(rects[i][j] == WHITE_COLOR) {  
//         console.log('Miss on postion ['+i+', '+j+'].');
//         rects[i][j] = GREY_COLOR;
//     }else if(rects[i][j] == GREEN_COLOR) {
//         rects[i][j] = RED_COLOR;
//         if(!validateShipsank()) {
//             console.log('Hit on postion ['+i+', '+j+'].');
//         }else {
//             console.log('You just sank the '+shiptype+' from postion ['+i+', '+j+'], to postion ['+i+', '+j+'].');
//             sankship_amt[shiptype]++;
//         }
//     }

//     if(sankship_amt == SHIP_AMT) {
//         console.log('Game over, you win');
//     }
// }

var initRects = function () {
    if(rects.length == 0) {
        i = 0;
        j = 0;
        while (i < BOARD_SIZE) {
            while (j < BOARD_SIZE) {
                if (!rects[i]) {
    		        rects[i] = [];
    		    }
    		    rects[i][j] = WHITE_COLOR;
                j += 1;
            }
            i += 1;
            j = 0;
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
        }
    }
    console.log('deployed success');

    return true;
}