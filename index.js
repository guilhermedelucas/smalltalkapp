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
      var query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING username';
      var params = [req.body.username, req.body.email, hashedPass];
      var fillUserTable = db.query(query, params);
      fillUserTable.then(function(data){
         req.session.user = {
            username: data.rows[0].username
         }
         res.json({
            success: true
         })
      })
   }).catch(function(err){
      console.log(err);
   })
});

app.post('/login', function(req, res){
   var query = 'SELECT username, password FROM users WHERE username = $1';;
   var params = [req.body.username];
   if (req.body.username && req.body.password) {
      var getPass = db.query(query, params);
      getPass.then(function(data){
         req.session.user = {
            username: data.rows[0].username
         }
         var checkPass = hashingAndChecking.checkPassword(req.body.password, data.rows[0]['password']); //typedPass, dbPass
         checkPass.then(function(data){
            // if pass match >> data = true
            if(data === true) {
               console.log("true");
               res.json({
                  success: true
               })
            } else if (data === false){
               console.log("false");
               res.json({
                  message: "Email or password is wrong! Please check and submit again."
               })
            }
         }).catch(function(err){
            console.log(err);
         });
      }).catch(function(err){
         console.log(err);
      });
   }
});

app.get('*', function(req, res){
   res.sendFile(__dirname + "/public/index.html");
})

app.listen(8080, function() {
    console.log('Listening')
});
