var express = require("express"),
	methodOverride = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	app = express(),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser");

mongoose.connect("mongodb+srv://admin:admin@blogpage-2020-rvgsd.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

var BlogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", BlogSchema);

// Blog.create({
// 	title: "test post",
// 	image: "https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
// 	body: "First Blog post for our app!"
// });

// Home route
app.get("/blogs", function (req, res) {
	var noMatch = null;
	// if(req.query.search) {
	//     const regex = new RegExp(escapeRegex(req.query.search), 'gi');
	//    // Get all Blogs from DB
	//   Blog.find({title: regex}, function(err, blogs){
	//        if(err){
	//            console.log(err);
	//        } else {
	//           if(blogs.length < 1) {
	//               noMatch = "No Blogs match that query, please try again.";
	//           }
	//            res.render("index", {blogs: blogs, noMatch: noMatch});
	//        }
	//     });
	// } else {
	//     // Get all Blogs from DB
	Blog.find({}, function (err, blogs) {
		if (err) {
			console.log(err);
		} else {
			res.render("index", { blogs: blogs, noMatch: noMatch });
		}
	})
});
//
// });
// 	Blog.find({}, function(err, blogs){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			res.render("index", {blogs: blogs});
// 		}
// 	});
// });


// root route
app.get("/", function (req, res) {
	res.redirect("/blogs");
});

// create route
app.get("/blogs/new", function (req, res) {
	res.render("new");
});

// New Route
app.post("/blogs", function (req, res) {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function (err, newBlog) {
		if (err) {
			res.render("new");
		} else {
			res.redirect("/blogs");
		}
	});
});

// Show route
app.get("/blogs/:id", function (req, res) {
	Blog.findById(req.params.id, function (err, foundBlog) {
		if (err) {
			res.redirect("/blogs");
		} else {
			res.render("shows", { blog: foundBlog });
		}
	});
});

// Edit Route
app.get("/blogs/:id/edit", function (req, res) {
	Blog.findById(req.params.id, function (err, foundBlog) {
		if (err) {
			res.redirect("/blogs");
		} else {
			res.render("edit", { blog: foundBlog });
		}
	});
});

// Update route
app.put("/blogs/:id", function (req, res) {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
		if (err) {
			res.redirect("/blogs")
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// Delete route
app.delete("/blogs/:id", function (req, res) {
	Blog.findByIdAndRemove(req.params.id, function (err, deletedBlog) {
		if (err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
 	})
});

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


app.listen(process.env.port || 3000, process.env.IP || 0.0.0.0/0, function () {
	console.log("Server has Started!");
})
