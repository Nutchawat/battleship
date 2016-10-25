var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BoardHistorySchema = new Schema({
	brdhis_id:  { type: String, required: true, unique: true },
	brdhis_brd_id: String,
	brdhis_usr_id: String,
	brdhis_session_id: String,
	brdhis_trn_id: String,
	brdhis_state: String, //Array String
	brdhis_status: String,
	brdhis_created_at: Date,
	brdhis_updated_at: Date	
});

BoardHistorySchema.pre('save', function(next) {
  	var currentDate = new Date();
  	this.brdhis_updated_at = currentDate;
  	if (!this.brdhis_created_at)
    	this.brdhis_created_at = currentDate;
  	next();
});

module.exports = mongoose.model('BoardHistory', BoardHistorySchema);
