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
        response.render("register/login", {referer:request.headers.referer});
    });
   
    //post Login form
    router.post("/login", passport.authenticate("local",{failureRedirect: "/login"}),(request, response)=>{	
        if (request.body.referer && (request.body.referer !== undefined)) {
            response.redirect(request.body.referer);
        } else {    
            response.redirect("/");
        }
    });

    //LOGOUT ROUTES
    router.get("/logout", (request, response) =>{
        request.logout();
        response.redirect("/"); 
        })
    

module.exports = router;