var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
	blogTitle: String,
	blogText: String,
        name: String,
        email: String,
	createdOn: {
	   type: Date,
	   "default": Date.now
	}
});

mongoose.model('blog', blogSchema);
