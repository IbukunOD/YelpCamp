var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    passport = require("passport");


//AUTH Routes
//=============

router.get("/register", (request, response) => {
    response.render("register/register");
});

router.post("/register", (request, response) => {
    var name = request.body.username;
    User.register(new User({ username: name }), request.body.password, (error, user) => {
        if (error) {
            console.log(error);
            request.flash("error", err);
            return response.render("register/register");
        }
        else {
            passport.authenticate("local")(request, response, () => {
                request.flash("success", "Welcome to YelpCamp " + user.username)
                response.redirect("/campground");
            })
        }
    });
});

//Show login form
router.get("/login", (request, response) => {
    response.render("register/login", { referer: request.headers.referer });
});

//post Login form
router.post("/login", passport.authenticate("local", { failureRedirect: "/login" }), (request, response) => {
    if (request.body.referer && (request.body.referer !== undefined)) {
        response.redirect(request.body.referer);
    } else {
        response.redirect("/");
    }
});

//LOGOUT ROUTES
router.get("/logout", (request, response) => {
    request.logout();
    request.flash("success", "Logged you out!");
    response.redirect("/");
})


module.exports = router;