var express=require('express'),
	bodyParser=require('body-parser'),
	app=express(),
	mongoose=require('mongoose'),
	methodOverride=require('method-override'),
	expressSanitizer=require('express-sanitizer');

mongoose.connect("mongodb+srv://code:code@cluster0-n96qz.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true},(err) => {
    if(!err){ console.log("MongoDB Connection Succeeded");}
    else{
        console.log("An Error Occured");
    }
})

mongoose.set('useFindAndModify', false);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);



app.get("/", function(req, res){
   res.redirect("/blogs"); 
});
//index
app.get("/blogs", function(req, res){
   Blog.find({}, function(err, blogs){
       if(err){
           console.log("ERROR!");
       } else {
          res.render("index", {blogs: blogs}); 
       }
   });
});
//new
app.get("/blogs/new",(req,res)=>{
	res.render("new");
})
//create
app.post("/blogs",(req,res)=>{
	req.body.blog.body=req.sanitize(req.body.blog.body)
	Blog.create(req.body.blog,(err,newBlog)=>{//console.log(req.body.blog);//here blog contains all the fields img,title and body
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/blogs");
		}
	})
})
//show
app.get("/blogs/:id",(req,res)=>{
	Blog.findById(req.params.id,(err,foundBlog)=>{
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("show",{blog:foundBlog})
		}
	})
})
//edit
app.get("/blogs/:id/edit",(req,res)=>{
	Blog.findById(req.params.id,(err,foundBlog)=>{
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("edit",{blog:foundBlog});
		}
	})
})
//update
app.put("/blogs/:id",(req,res)=>{
	req.body.blog.body=req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedBlog)=>{
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/"+req.params.id)
		}
	})
})
//delete
app.delete("/blogs/:id",(req,res)=>{
	Blog.findByIdAndRemove(req.params.id,(err)=>{
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	})
})

app.listen(3000,()=>{
	console.log("server running");
})
