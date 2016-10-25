var mongoose = require('mongoose');

var settings = require('./settings');

var mongo_uri = process.env.OPENSHIFT_MONGODB_DB_URL || settings.MONGO_URI;

module.exports.initialize = function(callback) {
	var options = {};
	mongoose.connect(mongo_uri, options);
	mongoose.connection.on('error', callback);
    mongoose.connection.once('open', callback);
};