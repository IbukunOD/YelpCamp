var express 	= require("express")
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	Campground 	= require("./models/campground"),
	Comment 	= require("./models/comment"),
	//User 		= require("./models/user");
	seedDB      = require("./seed")


mongoose.connect("mongodb://localhost:27017/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

/* ar campground = [{name: "spain", image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"}, 
{name: "spain", image: "https://images.unsplash.com/photo-1484960055659-a39d25adcb3c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"}, 
{name: "spain", image: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"},
{name: "spain", image: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"},
{name: "spain", image: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"},
{name: "spain", image: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"},
{name: "spain", image: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"},
{name: "spain", image: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"}, 
{name: "spain", image: "https://images.unsplash.com/photo-1528892677828-8862216f3665?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"}]
 */
 
seedDB();

app.get("/", (request, response) => {
	response.render("landing");
})

//Index route
app.get("/campground", (request, response) => {
	//get all campgrounds from the db

	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			response.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	})
})

//Create - show form to create new campground
app.post("/campground", (request, response) => {
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
app.get("/campground/new", (request, response) => {
	response.render("campgrounds/new");
})

//Show - show info about a campground
app.get("/campgrounds/:id", function(request, response){
	var id = request.params.id;
	Campground.findById(id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log();
		}
		else{
			response.render("campgrounds/show", {campground: foundCampground});
		}
	});
	
})


//comment routes
app.get("/campgrounds/:id/comments/new", (request, response) => {
	Campground.findById(request.params.id,(error, foundCampground) => {
		if(error){
			console.log(error);
		}
		else{
			response.render("comments/new",{campground: foundCampground});
		}
	})
	
})

app.post("/campground/:id/comments",(request, response) => {
	Campground.findById(request.params.id,(error, foundCampground) => {
	if(error){
		console.log(error);
	}
	else{
		Comment.create(request.body.comment, (error, comment) => {
			if(error){
				console.log();
			}else{
				foundCampground.comments.push(comment);
				foundCampground.save();
				response.redirect("/campgrounds/"+foundCampground._id)
			}
		})
	}
})

})



app.listen(3000, function(){console.log("YelpCamp has started!")});