var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BoardSchema = new Schema({
	brd_id: { type: String, required: true, unique: true },
	brd_usr_id: String,
	brd_session_id: String,
	brd_trn_id: String,
	brd_state: String, //Array String
	brd_depl_state: String, //Object String
	brd_depl_amt: String, //Object String
	brd_sank_amt: String, //Object String
	brd_status: String,
	brd_created_at: Date,
	brd_updated_at: Date
});

BoardSchema.pre('save', function(next) {
  	var currentDate = new Date();
  	this.brd_updated_at = currentDate;
  	if (!this.brd_created_at)
    	this.brd_created_at = currentDate;
  	next();
});

module.exports = mongoose.model('Board', BoardSchema);
