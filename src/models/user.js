var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	usr_id: { type: String, required: true, unique: true },
	usr_pwd: { type: String, required: true },
	usr_created_at: Date,
	usr_updated_at: Date
});

UserSchema.pre('save', function(next) {
  	var currentDate = new Date();
  	this.usr_updated_at = currentDate;
  	if (!this.usr_created_at)
    	this.usr_created_at = currentDate;
  	next();
});

module.exports = mongoose.model('User', UserSchema);
