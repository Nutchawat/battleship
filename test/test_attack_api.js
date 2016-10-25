var chakram = require('./../lib/chakram.js'),
    expect = chakram.expect;

describe("Single Attack API", function() {
    var apiResponse;
    var URL = "http://localhost:3000";

    describe("Specific attack board id 1 @ position 0, 1", function () {
        before(function () {
            apiResponse = chakram.get(URL+"/resetships/1");
            apiResponse = chakram.get(URL+"/deployship/battleship/0/0@1");
            apiResponse = chakram.get(URL+"/attackship/1/0@1");
            return apiResponse;
        });
        
        it("should return 200 on success", function () {
            return expect(apiResponse).to.have.status(200);
        });
        
        it("should return content type and server headers", function () {
            expect(apiResponse).to.have.header("content-type", /json/);
            return chakram.wait();
        });
      
        it("should include user, board", function () {
            return expect(apiResponse).to.have.schema({
                type: "object",
                properties: {
                    user: {
                        type: "object",
                        properties:{
                            id:          {type: "string"},
                            name:        {type: "string"},
                            state: {
                                type: "object",
                                properties: {
                                    status: {
                                        type: "object",
                                        properties:{
                                            code:   {type: "string"},
                                            detail: {type: "string"}
                                        },
                                        required: ["code"]
                                    },
                                    detail: {
                                        type: "object",
                                        properties:{
                                            board_id:   {type: "string"},
                                            position_attack_x: {type: "integer"},
                                            position_attack_y: {type: "integer"}
                                        },
                                        required: ["board_id", "position_attack_x", "position_attack_y"]
                                    }                 
                                },
                                required: ["status"]
                            }
                        }
                    }
                },
                required: ["user"]
            });
        });
        
        it("should return a hit code", function () {
            return expect(apiResponse).to.have.json('user.state.status.code', 'GN');
        });

        it("should return a hit detail", function () {
            return expect(apiResponse).to.have.json('user.state.status.detail', 'Game is not ready');
        });

        // it("should return a board id", function () {
        //     return expect(apiResponse).to.have.json('user.state.detail.board_id', '1');
        // });

        // it("should return an attack position x", function () {
        //     return expect(apiResponse).to.have.json('user.state.detail.position_attack_x', 0);
        // });

        // it("should return an attack position y", function () {
        //     return expect(apiResponse).to.have.json('user.state.detail.position_attack_y', 1);
        // });

        it("should only support GET calls", function () {
            this.timeout(4000);
            expect(chakram.post(URL+"/deployship/battleship/0/0@1")).to.have.status(404);
            expect(chakram.put(URL+"/deployship/battleship/0/0@1")).to.have.status(404);
            expect(chakram.delete(URL+"/deployship/battleship/0/0@1")).to.have.status(404);
            expect(chakram.patch(URL+"/deployship/battleship/0/0@1")).to.have.status(404);
            return chakram.wait();
        });

    });

});
