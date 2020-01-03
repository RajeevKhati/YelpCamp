var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'opencage',
  // httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY
};
 
var geocoder = NodeGeocoder(options);

//INDEX
router.get('/campgrounds', function(req, res){
  if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    Campground.find({name: regex}, function(err, allCampgrounds){
      if(err){
        console.log(err);
      }else{
        res.render('campgrounds/index', {campgrounds: allCampgrounds, page: 'campgrounds'});
      }
    });
  }else{
    Campground.find({}, function(err, allCampgrounds){
      if(err){
        console.log(err);
      }else{
        res.render('campgrounds/index', {campgrounds: allCampgrounds, page: 'campgrounds'});
      }
    });
  }
});

// Old Create route without Map Feature
// CREATE
// router.post('/campgrounds', middleware.isLoggedIn, function(req, res){
// 	var name = req.body.name;
// 	var price = req.body.price;
// 	var image = req.body.image;
// 	var desc = req.body.description;
// 	var author = {
// 		id: req.user._id,
// 		username: req.user.username
// 	}
// 	var newCampground = {name: name, price: price, image: image, description: desc, author: author};
// 	Campground.create(newCampground, function(err, newlyCreated){
// 		if(err){
// 			console.log(err)
// 		}else{
// 			res.redirect('/campgrounds');
// 		}
// 	});
// });

//CREATE - add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
    	console.log(err.message);
		req.flash('error', 'Invalid address');
	    return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = req.body.location;
    var newCampground = {name: name, price: price, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
  });
});

//NEW
router.get('/campgrounds/new', middleware.isLoggedIn, function(req, res){
	res.render('campgrounds/new');
});

//SHOW
router.get('/campgrounds/:id', function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show", {campground: foundCampground});
		}
	})
});

//EDIT
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.render("campgrounds/edit",{campground: foundCampground});			
		}
	})
});

//Old Update route without Map Feature
// UPDATE
// router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
// 	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
// 		if(err){
// 			res.redirect("/campgrounds");
// 		}else{
// 			res.redirect("/campgrounds/" + req.params.id);
// 		}
// 	});
// });

// UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});

function escapeRegex(text){
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;