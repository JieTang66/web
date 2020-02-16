var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
//var methodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var	indexRoutes = require("./routes/index");

mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));

app.use(flash());
//app.use(methodOverride("_method"));



seedDB();

//passport configuration
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});


app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
// Campground.create({
// 	name:"Salmon Creek",
// 	image:"http://images.freeimages.com/images/previews/e4c/camping-tent-1058140.jpg",
// 	description:"No bathroom,no water"
// },function(err,campground){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log("NEWLY CREATED CAMPGOUND");
// 		console.log(campground);
// 	}		  
// });

// var campgrounds = [
//         {name:"Salmon Creek", image: "http://images.freeimages.com/images/previews/e4c/camping-tent-1058140.jpg"},
//         {name:"Granite Hill", image: "http://images.freeimages.com/images/previews/e4c/camping-tent-1058140.jpg"},
//         {name:"Mountain Goat's Rest", image: "http://images.freeimages.com/images/previews/e4c/camping-tent-1058140.jpg"},
// 		{name:"Salmon Creek", image: "http://images.freeimages.com/images/previews/e4c/camping-tent-1058140.jpg"},
//         {name:"Granite Hill", image: "http://images.freeimages.com/images/previews/190/tents-1429142.jpg"},
//         {name:"Mountain Goat's Rest", image: "http://images.freeimages.com/images/previews/2e1/mountain-goats-1496501.jpg"}
// ];

// app.get("/",function(req,res){
// 	res.render("landing");
// });


// // app.get("/campgrounds",function(req,res){
// // 	//get all campgrounds from db
// // 	Campground.find({},function(err,allcampgrounds){
// // 		if(err){
// // 			console.log(err);
// // 		}else{
// // 			res.render("campgrounds/index",{campgrounds:allcampgrounds});
// // 		}
// // 	});
	
// // });
// app.get("/campgrounds", function (req, res) {
//   // Get all campgrounds from DB
//   Campground.find({}).populate("comments").exec(function (err, allCampgrounds) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser:req.user});
//     }
//   });
// });

// app.post("/campgrounds",function(req,res){
	
// 	//get data from form and add to campgrounds array
// 	var name = req.body.name
// 	var image = req.body.image
// 	var desc = req.body.description
// 	var newCampground = {name:name,image:image,description:desc};
// 	//create a new campground and save to DB
// 	Campground.create(newCampground,function(err,newlyCreated){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			//redirect back to campgrounds page
// 			res.redirect("/campgrounds");
// 		}
// 	});
	
	
// });


// app.get("/campgrounds/new", function(req,res){
// 	res.render("campgrounds/new");
// });

// //show more info
// app.get("/campgrounds/:id", function(req,res){
// 	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			res.render("campgrounds/show",{campground:foundCampground});
// 		}
// 	});
// });

// app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res){
// 	Campground.findById(req.params.id,function(err,campground){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			res.render("comments/new",{campground:campground});
// 		}
// 	});
// });

// app.post("/campgrounds/:id/comments", isLoggedIn,function(req,res){
// 	Campground.findById(req.params.id, function(err,campground){
// 		if(err){
// 			console.log(err);
// 			res.redirect("/campgrounds");
// 		}else{
// 			Comment.create(req.body.comment, function(err,comment){
// 				if(err){
// 					console.log(err);
// 				}else{
// 					campground.comments.push(comment);
// 					campground.save();
// 					res.redirect('/campgrounds/'+campground._id);
// 				}
// 			});
			
// 		}
// 	})
// });


// //auth routes
// //show register form
// app.get("/register", function(req,res){
// 	res.render("register");
// });
// //handle sign up logic
// app.post("/register", function(req,res){
// 	var newUser = new User({username: req.body.username});
// 	User.register(newUser,req.body.password, function(err,user){
// 		if(err){
// 			console.log(err);
// 			return res.render("register");
// 		}
// 		passport.authenticate("local")(req,res,function(){
// 			res.redirect("/campgrounds");
// 		});
// 	}); 
// });

// //show  login form
// app.get("/login",function(req,res){
// 	res.render("login");
// });

// //handle login logic
// //app.post("/login",middleware, callback)
// app.post("/login",passport.authenticate("local",
// 	{
// 		successRedirect:"/campgrounds",
// 		failureRedirect:"/login"
// 	}), function(req,res){
// });

// //logic route
// app.get("/logout", function(req,res){
// 	req.logout();
// 	res.redirect("/campgrounds");
// });

// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

app.listen(process.env.PORT || 3000, process.env.IP,function(){
	console.log("The YelpCamp Server Has Started!");
});
