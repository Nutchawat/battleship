angular.module('application.controllers')
    .controller('DeployShipsController', ['$scope', '$state', '_', 'DeployValidatorService', 'DeployShipsService', 'BattleshipService',
        function ($scope, $state, _, DeployValidatorService, DeployShipsService, BattleshipService) {

            var BOARD_SIZE = 10;
            var WHITE_COLOR = 'white';
            var GREEN_COLOR = 'green';
            var isReady = false;
            var myRects;
            $scope.isReadyButtonDisabled = true;
            $scope.readyButtonText = "I am ready!";

            var init = function() {
                $scope.current_ships = Array.apply(null, {length: DeployValidatorService.configuration.sizes.length+1})
                        .map(function () { return 0; });
            };

            $scope.onDeployClick = function(rects, i, j) {
                if(isReady === false) {
                    if (rects[i][j].color === WHITE_COLOR) {
                        if (isValidShipPlacement(rects, i, j)) {
                            rects[i][j].path.fillColor = GREEN_COLOR;
                            rects[i][j].color = GREEN_COLOR;
                        }
                    } else {
                        rects[i][j].path.fillColor = WHITE_COLOR;
                        rects[i][j].color = WHITE_COLOR;
                    }
                    $scope.current_ships = DeployValidatorService.validate(rects, i, j, isShip);
                    myRects = rects;
                }
            };

            $scope.clickReady = function() {
                isReady = true;
                $scope.readyButtonText = "Waiting for game...";
                $scope.isReadyButtonDisabled = true;
                DeployShipsService.setShips(convertShips(myRects));
                BattleshipService.setBoardAndReady(DeployShipsService.getShips(), function(gameName, isMyTurn) {
                    console.log(gameName + ' start');
                    $state.go('game', {isMyTurn: isMyTurn});
                });
                //alert("Waiting for other players.\nIt may take a few minutes.");
            };

            var isShip = function(rects, x, y) {
                if(x >= 0 && x < BOARD_SIZE && y >=0 && y < BOARD_SIZE) {
                    if (rects[x][y].color === GREEN_COLOR) {
                        return true;
                    }
                }
                return false;
            };

            var isValidShipPlacement = function(rects, x, y) {
                if(x > 0) {
                    if(y > 0 && rects[x - 1][y - 1].color === GREEN_COLOR) {
                        return false;
                    }
                    if(y < BOARD_SIZE-1 && rects[x - 1][y + 1].color === GREEN_COLOR) {
                        return false;
                    }
                }
                if(x < BOARD_SIZE-1) {
                    if(y > 0 && rects[x + 1][y - 1].color === GREEN_COLOR) {
                        return false;
                    }
                    if(y < BOARD_SIZE-1 && rects[x + 1][y + 1].color === GREEN_COLOR) {
                        return false;
                    }
                }
                return true;
            };

            var convertShips = function() {
                var ships = [];
                for (var i = 0; i < 10; i++) {
                    ships[i] = [];
                    for (var j = 0; j < 10; j++) {
                        ships[i][j] = (myRects[i][j].color === WHITE_COLOR ? 0 : 1);
                    }
                }
                return ships;
            };

            init();

        }
    ]);

