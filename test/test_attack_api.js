var chakram = require('./../lib/chakram.js'),
    expect = chakram.expect;

describe("Single Attack API", function() {
    var apiResponse;
    var URL = "http://localhost:3000";

    describe("Specific board attacking @ position 0, 1", function () {
        before(function () {
            apiResponse = chakram.get(URL+"/reset");
            apiResponse = chakram.get(URL+"/attack/0@1");
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
                            deploy_state: {type: "array"}
                        }
                    },
                    board: {
                        type: "array"
                    }
                },
                required: ["user","board"]
            });
        });

        it("should include status, detail, ship_count and status object include code, detail", function () {
            return expect(apiResponse).to.have.schema('result.user.deploy_state[0]', {
                "type": "object",
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
                            shiptype:   {type: "string"},
                            shipsize:   {type: "integer"},
                            land_code:  {type: "string"},
                            land_type:  {type: "string"},
                            position_start_x: {type: "integer"},
                            position_start_y: {type: "integer"}
                        },
                        required: ["shiptype", "land_code", "position_start_x", "position_start_y"]
                    },
                    ship_count: {
                        type: "object"
                    },                  
                },
                required: ["status", "detail", "ship_count"]
            });
        });
        
        it("should return a success code", function () {
            return expect(apiResponse).to.have.json('result.user.deploy_state[0].status.code', 'SS');
        });

        it("should return a success detail", function () {
            return expect(apiResponse).to.have.json('result.user.deploy_state[0].status.detail', 'deployed success');
        });

        it("should return a shiptype of battleship", function () {
            return expect(apiResponse).to.have.json('result.user.deploy_state[0].detail.shiptype', 'battleship');
        });

        it("should return a battleship size of (4)", function () {
            return expect(apiResponse).to.have.json('result.user.deploy_state[0].detail.shipsize', 4);
        });

        it("should return a horizontal code (0)", function () {
            return expect(apiResponse).to.have.json('result.user.deploy_state[0].detail.land_code', '0');
        });        

        it("should return a horizontal", function () {
            return expect(apiResponse).to.have.json('result.user.deploy_state[0].detail.land_type', 'horizontal');
        });

        it("should return a start position x", function () {
            return expect(apiResponse).to.have.json('result.user.deploy_state[0].detail.position_start_x', 0);
        });

        it("should return a start position y", function () {
            return expect(apiResponse).to.have.json('result.user.deploy_state[0].detail.position_start_y', 1);
        });

        it("should only support GET calls", function () {
            this.timeout(4000);
            expect(chakram.post(URL+"/attack/0@1")).to.have.status(404);
            expect(chakram.put(URL+"/attack/0@1")).to.have.status(404);
            expect(chakram.delete(URL+"/attack/0@1")).to.have.status(404);
            expect(chakram.patch(URL+"/attack/0@1")).to.have.status(404);
            return chakram.wait();
        });

    });

});
