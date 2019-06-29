var Campground = require("../models/campground"),
    Comment = require("../models/comment");
//all the middleware
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (request, response, next) {
    if (request.isAuthenticated()) {
        //does the user own the campground
        Campground.findById(request.params.id).populate().populate().exec((err, foundCampground) => {
            if (err) {
                request.flash("error", "Campground not found");
                response.redirect("back");
            }
            else {
                if (foundCampground.createdBy._id.equals(request.user._id)) {
                    next();
                }
                else {
                    request.flash("error", "You don't have permission to do that ");
                    response.redirect("back");
                }
            }
        });
    } else {
        request.flash("error", "you need to be logged `in to do that ");
        response.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (request, response, next) {
    if (request.isAuthenticated()) {
        //does the user own the campground
        Comment.findById(request.params.commentId, (err, foundComment) => {
            if (err) {
                console.log(err);
                response.redirect("back");
            }
            else {
                if (foundComment.author.id.equals(request.user._id)) {
                    next();
                }
                else {
                    response.redirect("back");
                }
            }
        });
    } else {
        request.flash("error", "You don't have permission to do that");
        response.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (request, response, next) {
    if (request.isAuthenticated()) {
        return next();
    }
    request.flash("error", "You need to be logged in to do that!");
    return response.redirect("/login");
}

module.exports = middlewareObj;