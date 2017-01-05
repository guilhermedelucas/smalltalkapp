var express = require('express');
var app = express();
var password = require("./password.json");
var spicedPg = require('spiced-pg');
var db = spicedPg('postgres:' + password.dbUser + ':' + password.dbPassword + '@localhost:5432/smalltalk');

var hashingAndChecking = require ('./password/checking-hashing');

var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(cookieSession({
   secret: process.env.SESSION_SECRET || 'Help Dogs!',
   maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: false
}));


app.use(express.static('public'));

app.use(function(req,res,next){
   //  console.log(req.url);
   //  console.log(req.params.tag);
   //  console.log(req.method);
   //  console.log(req.path);
    next();
});

app.post('/register', function(req, res){
   hashingAndChecking.hashPassword(req.body.password).then(function(hashedPass){
      var query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)';
      var params = [req.body.username, req.body.email, hashedPass];
      var fillUserTable = db.query(query, params);
      return fillUserTable.then(function(data){
         req.session.user = {
            username: req.body.username
         }
         res.json({
            success: true
         })
      })
   }).catch(function(err){
      if (err.detail.startsWith("Key (email)")){
         res.json({
            err: "Email already exists"
         })
      } else if(err.detail.startsWith("Key (username)")){
         res.json({
            err: "Username already exists"
         })
      } else {
         console.log(err);
      }
   })
});

app.post('/login', function(req, res){
   var query = 'SELECT password FROM users WHERE username = $1';
   var params = [req.body.username];
   var getPass = db.query(query, params);
   getPass.then(function(data){
      console.log(data);
      var checkPass = hashingAndChecking.checkPassword(req.body.password, data.rows[0]['password']); //typedPass, dbPass
      return checkPass.then(function(data){
         // if pass match >> data = true
         if(data === true) {
            console.log("password match");
            req.session.user = {
               username: req.body.user
            }
            res.json({
               success: true
            })
            console.log("response sent");
         } else if (data === false){
            console.log("password doesn't match");
            res.json({
               error: "Password is wrong! Please check and submit again."
            })
         }
      })
   }).catch(function(err){
      console.log(err);
      res.json({
         error: "Username is not correct!"
      });
   });
});

app.get('*', function(req, res){
   res.sendFile(__dirname + "/public/index.html");
})

app.listen(8080, function() {
    console.log('Listening')
});
