var chakram = require('./../lib/chakram.js'),
    expect = chakram.expect;

describe("Reset Board API", function() {
    var apiResponse;
    var URL = "http://localhost:3000";

    describe("Reset the game", function () {
        before(function () {
            apiResponse = chakram.get(URL+"/reset/1");
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
                            id:           {type: "string"},
                            name:         {type: "string"},
                            deploy_state: {type: "array"},
                            attack_state: {type: "array"},
                            state: {
                                type: "object",
                                properties: {
                                    status: {
                                        type: "object",
                                        properties: {
                                            code: "string",
                                            detail: "string"
                                        },
                                        required: ["code","detail"]
                                    },
                                    detail: {type: "object"}
                                },
                                required: ["status"]
                            }
                        },
                        required: ["id","name","state"]
                    }
                },
                required: ["user"]
            });
        });

        it("should not include ship_count", function () {
            return expect(apiResponse).to.not.have.schema('ship_count');
        });

        it("should return reset success code", function () {
            return expect(apiResponse).to.have.json('user.state.status.code', "RS");
        });

        it("should return reset success detail", function () {
            return expect(apiResponse).to.have.json('user.state.status.detail', "reset the game success");
        });

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
