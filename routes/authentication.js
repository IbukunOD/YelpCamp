var express = require("express"),
    router = express.Router(),
    User 		= require("../models/user"),
    passport 	= require("passport");


//AUTH Routes
//=============

    router.get("/register",(request,response)=>{
    response.render("register/register");
    });
    
    app.post("/register",(request,response)=>{
        
        User.register(new User({username: request.body.username}), request.body.password,(error, user)=>{
            if(error){
                console.log(error);
                console.log("we got here instead");
                return response.render("register/register");
            }
            else {
                passport.authenticate("local")(request, response, ()=>{
                    response.redirect("/campground");
                })
            }
        });
    });
    
    //Show login form
    router.get("/login", (request, response) => {
        response.render("register/login");
    });
    
    //post Login form
    router.post("/login", passport.authenticate("local",{
        successRedirect: "/campground",
        failureRedirect: "/login"
    }),(request, response)=>{	
    });
    
    //LOGOUT ROUTES
    router.get("/logout", (request, response) =>{
        request.logout();
        response.redirect("/"); 
        })
    
    function isLoggedIn(request, response, next){
    if(request.isAuthenticated()){
        return next();
    }
    return response.redirect("/login")
    }


module.exports = router;