var express = require("express"),
	router = express.Router({ mergeParams: true }),
	Campground = require("../models/campground"),
	Comment = require("../models/comment");

//comment New
router.get("/new", isLoggedIn, (request, response) => {
	Campground.findById(request.params.id, (error, foundCampground) => {
		if (error) {
			console.log(error);
		}
		else {
			response.render("comments/new", { campground: foundCampground, user: request.user });
		}
	})

})

//Commment create
router.post("/", isLoggedIn, (request, response) => {
	var commentText = request.body.comment.text;
	var commentTime = new Date().toString();

	Campground.findById(request.params.id, (error, foundCampground) => {
		if (error) {
			console.log(error);
		}
		else {
			Comment.create({ text: commentText, time: commentTime }, (error, comment) => {
				if (error) {
					console.log(error);
				} else {
					//add username and id to commit 
					//save comment
					comment.author.id = request.user._id;
					comment.author.username = request.user.username;
					comment.save();
					foundCampground.comments.push(comment);
					foundCampground.save();
					response.redirect("/campground/" + foundCampground._id)
				}
			})
		}
	})
})

//edit comment form 
router.get("/:commentId/edit",(request, response) => {
	Campground.findById(request.params.id, (error, foundCampground)=>{
		if(error){
			console.log(error);
		}
		else{
			Comment.findById(request.params.commentId, (error, foundComment)=>{
				if(error){
					console.log(error);
				}
				else{
					response.render("comments/edit", {comment: foundComment, campground: foundCampground});
				}
			})	
		}
	})

});

//update comment 
router.put("/:commentId", (request, response)=>{
	var commentTime = new Date().toString();
	Comment.findByIdAndUpdate(request.params.commentId,{text: request.body.text, time: commentTime}, (error, foundComment)=>{
		if(error){
			response.redirect("/campground");
		}
		else{
			response.redirect("/campground/"+request.params.id);
		}
	})	
})

router.delete("/:commentId", checkCommentOwnership, (request, response)=>{
	Comment.findByIdAndDelete(request.params.commentId, (error, deletedComment)=>{
		if(error){
			response.redirect("/campground");
		}
		else{
			Campground.findById(request.params.id,(err, foundCampground) =>{
				if(error){
					console.log(error)
				}else{
					var index = foundCampground.comments.indexOf(deletedComment._id);
					if(index > -1){
						foundCampground.comments.splice(index, 1);
						foundCampground.save();
						console.log(foundCampground.comments);
						response.redirect("/campground/"+request.params.id);	
					}
				}
			});	
			
		}
	})	
})

//Middleware
function isLoggedIn(request, response, next) {
	if (request.isAuthenticated()) {
		return next();
	}
	return response.redirect("/login")
}

function checkCommentOwnership(request, response, next){
	if(request.isAuthenticated()){ 
		//does the user own the campground
		Comment.findById(request.params.commentId, (err, foundComment) => {
			if(err){
				console.log(err);
				response.redirect("back");
			}
			else{
				if(foundComment.author.id.equals(request.user._id)){
				next();
			} 
			else{
				response.redirect("back");
			}
		}
		});
	}else{
		response.redirect("back");
	}
}


module.exports = router;