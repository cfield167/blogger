var mongoose = require('mongoose');

var chatSchema = new mongoose.Schema({
	chatText: String,
        sentTo: String,
        email: String,
	createdOn: {
	   type: Date,
	   "default": Date.now
	}
});

mongoose.model('chat', chatSchema);
