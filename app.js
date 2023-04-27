const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true,
    useUnifiedTopology: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String, 
    content: String
}

const Article = mongoose.model("Article", articleSchema);

//// Requests targeting all articles

app.get("/", async (req, res) => {
    await Article.find().then(foundArticles => {
        res.send(foundArticles)
    }).catch(err => {
        console.log(err);
    })
});

app.post("/articles", async (req, res) => {
    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save().then(success => {
        console.log("Succesfully added a new article");
    }).catch(err => {
        console.log(err);
    })
});

app.delete("/articles", function(req,res) {
    Article.deleteMany({}).then(function(){
        res.send("Successfully deleted all articles");
    }).catch(err=>{
        res.send(err);
    });
});


//// Requests targeting a single article

app.route("/articles/:articleTitle").get(function(req,res){
    Article.findOne({title:req.params.articleTitle}).then((foundArticle)=>{
        res.send(foundArticle);
    })
    .catch(err=>{
        res.send(err);
    });
});

app.route("/articles/:articleTitle").put(function(req,res) {
    Article.replaceOne(
        {title: req.params.articleTitle},
        {title: req.body.title,
         content: req.body.content
        },
        {overwrite: true}
    ).then(function() {
        res.send("successfully updated article");
    }).catch(function(err) {
        res.send(err);
    });
});

app.route("/articles/:articleTitle").patch(function(req,res) {
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body}
    ).then(function() {
        res.send("successfully updated article");
    }).catch(function(err) {
        res.send(err);
    });
});

app.route("/articles/:articleTitle").delete(function(req,res) {
    Article.deleteOne(
        {title: req.params.articleTitle},
        {$set: req.body}
    ).then((article) => {
        if(article) {
            res.send("Article deleted");
        } else{
            res.send("failed to delete");
        };
    });
});

app.listen(3000, function() {
    console.log("server started on port 3000");
});