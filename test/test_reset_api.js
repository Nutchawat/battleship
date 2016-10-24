var chakram = require('./../lib/chakram.js'),
    expect = chakram.expect;

describe("Reset Board API", function() {
    var apiResponse;
    var URL = "http://localhost:3000";

    describe("Reset the game", function () {
        before(function () {
            apiResponse = chakram.get(URL+"/reset");
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
            return expect(apiResponse).to.have.schema('result', {
                "type": "object",
                properties: {
                    user: {
                        type: "object",
                        properties:{
                            id:          {type: "string"},
                            name:        {type: "string"},
                            deployments: {type: "array"}
                        }
                    },
                    board: {
                        type: "array"
                    }
                },
                required: ["user","board"]
            });
        });

        it("should not include ship_count", function () {
            return expect(apiResponse).to.not.have.schema('result.ship_count');
        });

        it("should return empty array", function () {
            return expect(apiResponse).to.have.json('result.board', []);
        });

        it("should return empty array", function () {
            return expect(apiResponse).to.have.json('result.user.deployments', []);
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
