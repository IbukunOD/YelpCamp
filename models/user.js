var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userschema= new mongoose.Schema({
    username: String,
    password: String,
    comments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }
});

userschema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userschema);