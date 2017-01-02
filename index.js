var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//queries//
var password = require("./password.json");
var spicedPg = require('spiced-pg');
var db = spicedPg('postgres:' + password.dbUser + ':' + password.dbPassword + '@localhost:5432/smalltalk');
//queries//


app.use(express.static('public'));

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
