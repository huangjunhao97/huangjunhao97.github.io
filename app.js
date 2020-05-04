var expressSanitizer = require("express-sanitizer"),
bodyParser           = require("body-parser"),
methodOverride       = require("method-override"),
express              = require("express"),
mongoose             = require("mongoose");
app                  = express(),

mongoose.connect("mongodb+srv://dbuser:dbuserdbuser@cluster0-xy1ox.mongodb.net/blogapp?retryWrites=true&w=majority", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(expressSanitizer());//should be declaim after body-parser

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "The Blog",
//     image: "https://images.unsplash.com/photo-1588467648058-588a019cbdd7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
//     body: "Hello, this is a blog post"
// });



app.get("/", function(req, res) {
    res.render("home.ejs");
})

app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("index.ejs", {blogs: blogs});
        }
    })
})


app.get("/blogs/new", function(req, res) {
    res.render("new");
})

app.post("/blogs", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            console.log(err);
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    })
})

app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    })
})

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    })
})

app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/"+req.params.id);
        }
    })
})

app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err, deleteBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
})




app.listen(3000, function() {
    console.log("BlogApp server connected.");
    
})