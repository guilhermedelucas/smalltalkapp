var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//queries//
var password = require("./password.json");
var spicedPg = require('spiced-pg');
var db = spicedPg('postgres:' + password.dbUser + ':' + password.dbPassword + '@localhost:5432/smalltalk');
//queries//


app.use(express.static('public'));

app.get('/home', function(req, res) {
    db.query('SELECT * FROM posts LIMIT 10').then(function(data){
        res.json({
            posts: data.rows
        });
    }).catch(function(err){
        console.log(err);
        res.sendStatus(500);
    });
});

app.use(function(req,res, next){
    console.log(req.url);
    console.log(req.params.tag);
    console.log(req.method);
    console.log(req.path);
    next();
});

app.listen(8080, function() {
    console.log('Listening')
});
