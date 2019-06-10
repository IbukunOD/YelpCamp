var express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground 	= require("../models/campground"),
    Comment 	= require("../models/comment");

//comment New
router.get("/new", isLoggedIn, (request, response) => {
	Campground.findById(request.params.id,(error, foundCampground) => {
		if(error){
			console.log(error);
		}
		else{
			response.render("comments/new",{campground: foundCampground,user: request.user});
		}
	})
	
})

//Commment create
router.post("/",isLoggedIn, (request, response) => {
	var commentText = request.body.comment.text;
	var commentTime = new Date().toString();

	Campground.findById(request.params.id,(error, foundCampground) => {
	if(error){
		console.log(error);
	}
	else{
		Comment.create({text: commentText, time: commentTime}, (error, comment) => {
			if(error){
				console.log(error);
			}else{
                //add username and id to commit 
                //save comment
                comment.author.id = request.user._id;
                comment.author.username = request.user.username;
                comment.save();
				foundCampground.comments.push(comment);
				foundCampground.save();
				response.redirect("/campground/"+foundCampground._id)
			}
		})
	}
})

})

//Middleware
function isLoggedIn(request, response, next){
    if(request.isAuthenticated()){
        return next();
    }
    return response.redirect("/login")
    }


module.exports = router;