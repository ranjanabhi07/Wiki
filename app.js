const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose =require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

/////////////////////////////////////   Request Targitting all Articles   ////////////////////////////////////////////////////////

// chaining the routes using express
app.route("/articles")
.get(function(req,res){

    //  Read database
        Article.find({}).then(function(foundArticles){
            res.send(foundArticles);
        }).catch(function(error){
            console.log(error);
        });
    
    })
.post(function(req,res){
    // console.log(req.body.title);
    // console.log(req.body.content);

    // document  created 
    const newArticle =  new Article ({
        title : req.body.title,
        content : req.body.content
    });

    // Create database
    newArticle.save().then(function(){
        res.send("Successfully added a new article.");
    }).catch(function(error){
        res.send(error);
    });
})
.delete(function(req,res){
    // delete database
    Article.deleteMany().then(function(){
        res.send("Successfully deleted all articles");
    }).catch(function(error){
        res.send(error);
    });
});

 
// // GET request
// app.get("/articles", );

// // POST request 
// app.post("/articles", );

// // DELETE request
// app.delete("/articles", );

////////////////////////////////  Request targetting a specific Article ////////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.findOne({title: req.params.articleTitle}).then(function(foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        } else {
            res.send("No articles matching that title was found.");
        }
    }).catch(function(error){
        console.log(error);
    })
})  

.put(function(req,res){
     Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content}
        ).then(function(){
            res.send("Successfully updates article");
        }).catch(function(error){
            console.log(error); 
        })
})

.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body}
        ).then(function(){
            res.send("Successfully updated articles.")
        }).catch(function(error){
            console.log(error);
        })
})

.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle}
        ).then(function(){
            res.send("Successfully deleted the corresponding article");
        }).catch(function(error){
            console.log(error);
        })
});


app.listen("3000",function(req,res){
    console.log("Server is successfully running");
});
