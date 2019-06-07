var express = require("express"),
    router = express.Router(),
	Campground 	= require("../models/campground");
	
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

//Create - show form to create new campground
router.post("/", isLoggedIn, (request, response) => {
	var name = request.body.name;
	var image = request.body.image;
	var description = request.body.description;

	Campground.create({name: name, image: image, description: description}, function(err, campground){
		if(err){
			console.log(err);
		}
		else{
			response.redirect("/campground");
		}
	});
})

//New - show form to create new campground
router.get("/new", isLoggedIn, (request, response) => {
	authUser = request.user;
	response.render("campgrounds/new",{user: authUser});
})

//Show - show info about a campground
router.get("/:id", function(request, response){
	authUser = request.user;
	var id = request.params.id;
	Campground.findById(id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log();
		}
		else{
			response.render("campgrounds/show", {campground: foundCampground,user: authUser});
		}
	});
	
})

function isLoggedIn(request, response, next){
    if(request.isAuthenticated()){
        return next();
    }
    return response.redirect("/login")
    }

module.exports = router;
