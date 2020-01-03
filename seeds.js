var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
	{
		name:"Cloud's Rest",
		image:"https://cdn.pixabay.com/photo/2016/01/26/23/32/camp-1163419__340.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magnaaliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name:"Desert Mesa",
		image:"https://cdn.pixabay.com/photo/2016/08/28/17/05/camping-1626412__340.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magnaaliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name:"Canyon Floor",
		image:"https://cdn.pixabay.com/photo/2016/06/06/08/32/tent-1439061__340.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magnaaliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	}
]

function seedsDB(){
	Campground.deleteMany({}, function(err){
		if(err){
			console.log(err);
		}else{
			console.log("removed all campgrounds");
			data.forEach(function(seed){
				Campground.create(seed, function(err, campground){
					if(err){
						console.log(err);
					}else{
						console.log("added a campground");
						//create a comment
						Comment.create(
						{
							text: "This place is great, but i wish there was internet",
							author: "Homer"
						}, function(err, comment){
							if(err){
								console.log(err);
							}else{
								campground.comments.push(comment);
								campground.save();
								console.log("created new comment");
							}
						});
					}
				});
			});		
		}
	});
}

module.exports = seedsDB;
