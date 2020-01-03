var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//=============
//COMMENTS ROUTE
//=============

//NEW
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground : foundCampground});
		}
	})
});

//CREATE
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, function(err, newComment){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				}else{
					// add username and id to comment
					newComment.author.id = req.user._id;
					newComment.author.username = req.user.username;
					// save comment
					newComment.save();
					foundCampground.comments.push(newComment);
					foundCampground.save();
					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/" + foundCampground._id);
				}
			});
		}
	});
});

//RENDERING EDIT COMMENT FORM
router.get("/campgrounds/:id/comments/:comment_id/edit", function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

// UPDATING COMMENT
router.put("/campgrounds/:id/comments/:comment_id", function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DELETE COMMENT
router.delete("/campgrounds/:id/comments/:comment_id", function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

////watch lecture "Comment Authorization" in folder "YelpCamp update and destroy"
//function checkCommentOwnership(){}


module.exports = router;
