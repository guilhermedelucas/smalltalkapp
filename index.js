var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//queries//
var password = require("./password.json");
var spicedPg = require('spiced-pg');
var db = spicedPg('postgres:' + password.dbUser + ':' + password.dbPassword + '@localhost:5432/smalltalk');
//queries//
app.use(bodyParser.urlencoded({ extended: false }))


app.use(express.static('public'));


app.use(function(req,res, next){
    console.log(req.url);
    console.log(req.params.tag);
    console.log(req.method);
    console.log(req.path);
    next();
});


app.get('/home/:id', function(req, res) {
    console.log(req.params);
    db.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT $1', [10 + req.params.id*10]).then(function(data){
        res.send({
            posts: data.rows
        });
    }).catch(function(err){
        console.log(err);
        res.sendStatus(500);
    });
});

app.get('/getpost=:id', function(req, res) {
    db.query('SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC',  [req.params.id]).then(function(comments){
        db.query('SELECT * FROM posts WHERE id = $1', [req.params.id]).then(function(post){
        res.send({
            comments: comments.rows,
            postData: post.rows
        });
    })
    }).catch(function(err){
        console.log(err);
        res.sendStatus(500);
    });
});

app.get("*", function(req, res){
    res.sendFile(__dirname + "/public/index.html");
});


app.listen(8080, function() {
    console.log('Listening')
});
