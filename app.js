var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var expressSanitizer = require("express-sanitizer");
var mongoose = require('mongoose');
var methodOverride = require('method-override');
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/blog_app");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static("public"));

var blogSchema = new mongoose.Schema({
    title: String,
    image: {type: String, default: 'http://denrakaev.com/wp-content/uploads/2015/03/no-image-800x511.png'},
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "My Life",
//     image: "https://upload.wikimedia.org/wikipedia/en/0/07/Lifetitle.jpg",
//     body:"This is my first ever blog post"
// });

app.get("/",(req,res)=>{
    res.redirect("/blogs");
});

//INDEX Routes
app.get("/blogs",function(req,res){
    Blog.find({}, function(err,blogs){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("index", {blogs : blogs});
        }
    });
});

//NEW ROUTE
//CREATE ROUTE


app.get("/blogs/new", function(req,res){
    res.render("new");
})


//POST route
app.post("/blogs", function(req,res){
    
    req.body.blog.body = req.sanitize(req.body.blog.body);
    if(!req.body.blog.image)
    {
        delete req.body.blog.image;
    }
    Blog.create(req.body.blog, function(err, newBlog){
        if(err)
        {
            res.redirect("/blogs/new");
        }
        else
        {
            res.redirect("/blogs");
        }
    });
});

//SHOW route

app.get("/blogs/:id", function(req,res){
   
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.render("show", {blog : foundBlog});
        }
    });
});

app.get("/blogs/:id/edit", function(req,res){
    
    Blog.findById(req.params.id, function(err, foundBlogForEdit){
       if(err)
       {
           res.redirect("/blogs");
       }
       else
       {
           res.render("edit", {blog: foundBlogForEdit});
       }
    });
    
});


//Update route banega ab aur iske liye humko ek put request ko banana padega aur wo thda sa tricky rehta hai


app.put("/blogs/:id", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, foundUpdatedBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.redirect("/blogs/" + req.params.id);
        }
        
    });
});


//Delete route banega idhar

app.delete("/blogs/:id", function(req, res){
    //destroy blog
    //redirect somewhere
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.redirect("/blogs");
        }
    });
    
});





app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server has been started");
})