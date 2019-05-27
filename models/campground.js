var mongoose = require("mongoose");
//var Comment = require("./models/comment");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Comment"
    }]
});

module.exports = mongoose.model("Campground", campgroundSchema);