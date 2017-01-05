var express = require('express');
var app = express();
var password = require("./password.json");
var spicedPg = require('spiced-pg');
var db = spicedPg('postgres:' + password.dbUser + ':' + password.dbPassword + '@localhost:5432/smalltalk');

app.use(bodyParser.urlencoded({
    extended: false }));

app.use(bodyParser.json({
    extended: false }));
var hashingAndChecking = require ('./password/checking-hashing');

var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(cookieSession({
   secret: process.env.SESSION_SECRET || 'Help Dogs!',
   maxAge: 1000 * 60 * 60 * 24 * 14
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
         console.log(data);
         console.log(data.rows[0].username);
         req.session.user = {
            username: data.rows[0].username
         }
         var checkPass = hashingAndChecking.checkPassword(req.body.password, data.rows[0]['password']); //typedPass, dbPass
         checkPass.then(function(data){
            if(data === true) {
               //response with json to redirect to homepage
            } else if (data === false){
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

app.post('/submit', function(req, res) {
    var username = 'guilher';
    var title = req.body.title;
    var url = req.body.url;
    var text = req.body.text;
    if (!url.toLowerCase().startsWith('http')){
        url = 'http://' + url;
    }
    var query = 'INSERT INTO posts (username, title, url, post) VALUES ($1, $2, $3, $4) RETURNING *;';
    var parameters = [username, title, url, text];
    db.query(query, parameters).then(function(data){
        res.json({
            posts: data.rows
        });
    }).catch(function(err){
        console.log(err);
        res.sendStatus(500);
    });
});

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(8080, function() {
    console.log('Listening')
});
