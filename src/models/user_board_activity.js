var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserBoardAcitvitySchema = new Schema({
	user: {
  		id: { type: String, required: true, unique: true },
  		password: { type: String, required: true },
  		name: String,
  		deploy_state: [
	        {
				status: {
					code: String,
					detail: String
				},
				detail: {
					shiptype: String,
					shipsize: Number,
					land_code: String,
					land_type: String,
					position_start_x: Number,
					position_start_y: Number
				},
				ship_count: {
					battleship: Number,
					cruiser: Number,
					destroyer: Number,
					submarine: Number
				}
	        }
  		],
  		attack_state: [
	        {
	        	status: {
	            	code: String,
	            	detail: String
	          	},
	          	detail: {
	            	enemy_id: String,
	            	position_attack_x: Number,
	            	position_attack_y: Number
	          	}
	        }
  		],
  		reset_state: [
    		{
      			status: {
        			code: String,
        			detail: String
      			},
      			detail: Object
    		}
  		]
	},
	board: Array,
	created_at: Date,
	updated_at: Date
});

module.exports = mongoose.model('UserBoardAcitvity', UserBoardAcitvitySchema);
