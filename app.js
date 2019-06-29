var express 	= require("express")
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	Campground 	= require("./models/campground"),
	Comment 	= require("./models/comment"),
	User 		= require("./models/user"),
	flash		= require("connect-flash"),
	passport 	= require("passport"),
	localStrategy	= require("passport-local"),
	methodOverride = require("method-override"),
	seedDB      = require("./seed");

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	authRoutes = require("./routes/authentication"),
	indexRoutes = require("./routes/index");


mongoose.connect("mongodb://localhost:27017/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"))

//seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(request, response, next){
	//add to every template
	response.locals.currentUser = request.user;
	response.locals.error = request.flash("error");
	response.locals.success = request.flash("success");
	next(); 
})

app.use(indexRoutes);
app.use("/campground",campgroundRoutes);
app.use("/campground/:id/comments",commentRoutes);
app.use(authRoutes);

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.listen(3000, function(){console.log("YelpCamp has started!")});