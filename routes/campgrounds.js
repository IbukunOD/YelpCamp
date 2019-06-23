var express = require("express"),
    router = express.Router(),
	Campground 	= require("../models/campground"),
	Comment = require("../models/comment")
    User 	= require("../models/user");

//Index route
router.get("/",(request, response) => {
	//get all campgrounds from the db
	authUser = request.user;
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			response.render("campgrounds/index", {campgrounds: allCampgrounds, user: authUser});
		}
	})
})

//Create - Add new campground to the database
router.post("/", isLoggedIn, (request, response) => {
	var name = request.body.name;
	var image = request.body.image;
	var description = request.body.description;
    var currentUser = request.user;


    User.findById({_id: currentUser._id}, (error, user)=>{
        if(error){
            console.log();
        }
        else{
            Campground.create({name: name, image: image, description: description, createdBy: user}, function(err, campground){
                if(err){
                    console.log(err);
                }
                else{
                    response.redirect("/campground");
                }
            });
        }
    })
	
})

//New - show form to create new campground
router.get("/new", isLoggedIn, (request, response) => {
	response.render("campgrounds/new",{user: request.user});
})

//Show - show info about a campground
router.get("/:id", function(request, response){

	var id = request.params.id;
	Campground.findById(id).populate("comments").populate("createdBy").exec(function(err, foundCampground){
		if(err){
			console.log();
		}
		else{
			response.render("campgrounds/show", {campground: foundCampground,user: request.user});
		}
	});
})


//Edit route 
//show edit page
router.get("/:id/edit", checkCampgroundOwnership, (request, response)=>{
		Campground.findById(request.params.id).populate().populate().exec((err, foundCampground) => {		
				response.render("campgrounds/edit", {campground: foundCampground, user: request.user});	
		});	
});

//processes the form
router.put("/:id", checkCampgroundOwnership, (request, response) => {
	var id = request.params.id;
	Campground.findByIdAndUpdate(id,request.body.campground,(error, updatedCampground) => 
	{
		if(error){
			response.redirect("/campground");
		}
		else{
			response.redirect("/campground/"+id);
		}
	});
});

router.delete("/:id", checkCampgroundOwnership, (request, response) => {
	Campground.findOneAndDelete(request.params.id, (error, deletedCampground) =>{
		if(error){
			console.log(error)
			response.redirect("/campground");
			}	
			Comment.deleteMany({_id: {$in: deletedCampground.comments}},(err) =>{
				if(error){
					console.log(error)
				}
				response.redirect("/campground");
			});	
			
	})
})

//----------------- middleware---------------
function isLoggedIn(request, response, next){
    if(request.isAuthenticated()){
        return next();
    }
    return response.redirect("/login")
	}
	
function checkCampgroundOwnership(request, response, next){
	if(request.isAuthenticated()){
		//does the user own the campground
		Campground.findById(request.params.id).populate().populate().exec((err, foundCampground) => {
			if(err){
				console.log(err);
				response.redirect("back");
			}
			else{
				if(foundCampground.createdBy._id.equals(request.user._id)){
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
