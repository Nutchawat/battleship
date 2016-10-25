angular.module('application.directives')
    .controller('MainCtrl', function($scope, $http) {
        $http.get("/board/brd001")
        .then(function(response) {
            $scope.rects = response.data;
        });
    })
    .directive('board', [
        function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'views/board/board.html',
                scope: {
                    control: '=',
                    onBoardCreated: '='
                },
                link: function (scope) {
                    var BOARD_PIXEL_SIZE = 300;
                    var GREEN_COLOR = 'green';
                    var WHITE_COLOR = 'white';
                    var GREY_COLOR  = 'grey';
                    var RED_COLOR   = 'red';
                    var BLACK_COLOR = 'black';
                    var rects = [];

                    var getRectToDraw = function (p, i, j) {
                        path = new Path.Rectangle(new Rectangle(i * BOARD_PIXEL_SIZE / 10 + 1, j * BOARD_PIXEL_SIZE / 10 + 1, BOARD_PIXEL_SIZE / 10, BOARD_PIXEL_SIZE / 10));
                        path.strokeColor = BLACK_COLOR;
                        var v_color = '';
                        if(p == "0") {
                            path.fillColor = WHITE_COLOR;
                            v_color = WHITE_COLOR;
                        }else if(p == "1") {
                            path.fillColor = GREEN_COLOR;
                            v_color = GREEN_COLOR;
                        }else if(p == "2") {
                            path.fillColor = GREY_COLOR;
                            v_color = GREY_COLOR;
                        }else if(p == "3") {
                            path.fillColor = RED_COLOR;
                            v_color = RED_COLOR;
                        }

                        if (!rects[i]) {
                            rects[i] = [];
                        }
                        rects[i][j] = {
                            path: path,
                            color: v_color
                        };
                        rects[i][j].path.onClick = function () {
                            if (scope.onClick) {
                                scope.onClick(rects, i, j);
                            }
                        };
                    };

                    var init = function () {
                        rects = scope.control;

                        paper.install(window);
                        canvases = document.getElementsByTagName('canvas');
                        p = paper.setup(canvases[canvases.length - 1]);

                        var path1 = new Path(new Point(1, 1), new Point(1, BOARD_PIXEL_SIZE + 1));
                        path1.strokeColor = BLACK_COLOR;
                        var path2 = new Path(new Point(1, BOARD_PIXEL_SIZE + 1), new Point(BOARD_PIXEL_SIZE + 1, BOARD_PIXEL_SIZE + 1));
                        path2.strokeColor = BLACK_COLOR;
                        var path3 = new Path(new Point(BOARD_PIXEL_SIZE + 1, BOARD_PIXEL_SIZE + 1), new Point(BOARD_PIXEL_SIZE + 1, 1));
                        path3.strokeColor = BLACK_COLOR;
                        var path4 = new Path(new Point(BOARD_PIXEL_SIZE + 1, 1), new Point(1, 1));
                        path4.strokeColor = BLACK_COLOR;

                        i = 0;
                        j = 0;
                        while (i < 10) {
                            while (j < 10) {
                                getRectToDraw(rects[i][j], i, j);
                                j += 1;
                            }
                            i += 1;
                            j = 0;
                        }
                        paper.view.draw();

                        if (scope.onBoardCreated) {
                            scope.onBoardCreated({rects: rects});
                        }
                    };

                    init();
                }
            }
        }
    ]);