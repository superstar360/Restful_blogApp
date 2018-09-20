var bodyParser       = require("body-parser"),
    methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose         = require("mongoose"),
    express          = require("express"),
    app              = express();

// APP CONFIG
// require('dotenv').config();
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));



// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);


// RESFUL ROUTES

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1502083728181-687546e77613?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e11ef2edff62a7a7701cfbe89d020b19&auto=format&fit=crop&w=500&q=60",
//     body: "HELLO THIS IS A BLOG POST"
// }, function(err, blog){
//     if(err){
//         console.log(err);
//     } else {
//         console.log(blog);
//     }
// });

// ROOT ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
});

// INDEX ROUTES
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
    
});

// NEW ROUTES
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// CREATE ROUTES
app.post("/blogs", function(req, res){
    // create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            // then, redirect to the index
            res.redirect("/blogs");
        }
    });
    
});

// SHOW ROUTES
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.render("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

// EDIT ROUTES
app.get("/blogs/:id/edit", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

// UPDATE ROUTES 
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE ROUTES
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.get("/register", function(req, res){
    res.render("register");
});


app.listen(process.env.PORT, process.env.ID, function(){
    console.log("The resful blog app server is running smoothly!!!");
});