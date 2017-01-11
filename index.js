var express = require('express');
var app = express();
var password = require("./password.json");
var spicedPg = require('spiced-pg');
var db = spicedPg('postgres:' + password.dbUser + ':' + password.dbPassword + '@localhost:5432/smalltalk');
var hashingAndChecking = require('./password/checking-hashing');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var hashingAndChecking = require('./password/checking-hashing');
var http = require('http');
var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
// var zxcvbn = require('zxcvbn');

app.use(cookieParser());
app.use(cookieSession({
    secret: process.env.SESSION_SECRET || 'Help Dogs!',
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.use(express.static('public'));


app.use(function(req, res, next) {
    console.log(req.url);
    console.log(req.params.tag);
    console.log(req.method);
    console.log(req.path);
    next();
});

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json({
    extended: false
}));


setInterval(function() {
    request('https://source.unsplash.com/random/1440x900', {
        encoding: 'binary'
    }, function(req, res, body) {
        fs.writeFile('./public/images/background.jpg', body, 'binary', function(err) {
            console.log(err);
        });
        console.log("image_changed");
    });
}, 1000000);


app.get('/submit/checksession', function(req, res){
    if (req.session.username) {
        res.json({
            username: req.session.username
        });
    } else {
        res.redirect("/");
    }
});

app.post('/submit', function(req, res) {
    var username = req.body.username;
    var title = req.body.title;
    var url = req.body.url || "";
    var text = req.body.text || "";
    console.log("this is the url " +  url );
    if (!url.toLowerCase().startsWith('http')) {
        url = 'http://' + url;
    }
    request(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            if ($('meta[property="og:image"]').attr('content')) {
                var imageUrl = $('meta[property="og:image"]').attr('content');
            } else {
                imageUrl = './images/PH/ph.jpg';
            }
        } else {
            imageUrl = './images/PH/ph.jpg';
        }
        postentry(imageUrl);
    });
    function postentry(imageUrl) {
        var query = 'INSERT INTO posts (username, title, url, post, imageurl) VALUES ($1, $2, $3, $4, $5) RETURNING *;';
        var parameters = [username, title, url, text, imageUrl];
        db.query(query, parameters).then(function(data) {
            res.json({
                sucess: true
            });
        }).catch(function(err) {
            console.log(err);
            res.json({
                sucess: false
            });
            res.sendStatus(500);
        });
    }
});

app.get('/user/getposts', function(req, res) {
    db.query("SELECT * FROM posts WHERE username = $1", [req.session.username]).then(function(data) {
        console.log(data);
        res.json({
            userPosts: data.rows,
            session: req.session.username
        })
    }).catch(function(err) {
        console.log(err);
        res.sendStatus(500);
    });

    console.log(req.params.id);
})

app.post('/user/deletepost', function(req, res) {
    var deleteId = req.body.deleteId;
    db.query('DELETE FROM posts WHERE id = $1', [deleteId]).then(function() {
        return db.query('DELETE FROM comments WHERE post_id = $1', [deleteId]).then(function() {
            res.json({
                sucess: true
            });
        })
    }).catch(function(err) {
        console.log(err);
    })
});

app.post('/submit/reply', function(req, res){
    console.log(req.session);
    db.query('INSERT INTO comments (username, post_id, comment_id, comment) VALUES ($1, $2, $3, $4)', [req.session.username, req.body.post_id, req.body.comment_id, req.body.comment]).then(function(){
        res.json({
            sucess: true
        });
    }).catch(function(err){
        res.json({
            sucess: false
        })
        console.log(err);
    });
});


app.get('/logout', function(req, res) {
    req.session = null;
    res.json({
        logout: "sucess"
    })
});


app.get('/profile', function(req, res) {
    if (req.session.username) {
        db.query('SELECT username, email, about FROM users WHERE username = $1', [req.session.username]).then(function(data) {
            res.json({
                userData: data.rows,
                session: req.session.username
            })
        })
    } else {
        res.redirect("/");
    }
});

app.post("/profile/username", function(req, res) {
    db.query('SELECT EXISTS (SELECT username FROM users WHERE username = $1)', [req.body.username]).then(function(data) {
        res.json({
            usernameExists: data.rows[0].exists
        })
    }).catch(function(err) {
        console.log(err);
    })
})

app.post("/profile/email", function(req, res) {
    db.query('SELECT EXISTS (SELECT email FROM users WHERE email = $1)', [req.body.email]).then(function(data) {
        res.json({
            emailExists: data.rows[0].exists
        })
    }).catch(function(err) {
        console.log(err);
    })
})


app.get('/home/:id', function(req, res) {
    var sessionUsername;
    if (req.session.username) {
        db.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT $1', [10 + req.params.id * 10]).then(function(data) {
            return db.query('SELECT  post_id, COUNT (post_id) FROM  comments GROUP BY  post_id;').then(function(counter){
            res.json({
                posts: data.rows,
                session: req.session.username,
                totalPosts: counter.rows

            });
            })
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    } else {
        db.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT $1', [10 + req.params.id * 10]).then(function(data) {
            return db.query('SELECT  post_id, COUNT (post_id) FROM  comments GROUP BY  post_id;').then(function(counter){
            res.json({
                posts: data.rows,
                totalPosts: counter.rows
            });
            })
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });

    }
});

app.get('/getpost=:id', function(req, res) {
    if (req.session.username) {
        db.query('SELECT * FROM comments WHERE post_id = $1', [req.params.id]).then(function(comments) {
            db.query('SELECT * FROM posts WHERE id = $1', [req.params.id]).then(function(post) {
                res.send({
                    comments: comments.rows,
                    postData: post.rows,
                    username: req.session.username
                });
            });
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    } else {
        db.query('SELECT * FROM comments WHERE post_id = $1', [req.params.id]).then(function(comments) {
            db.query('SELECT * FROM posts WHERE id = $1', [req.params.id]).then(function(post) {
                res.send({
                    comments: comments.rows,
                    postData: post.rows,
                });
            });
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    }
});

app.post('/addcomment', function(req, res) {
    console.log(req.body);
    db.query('INSERT INTO comments (username, post_id, comment) VALUES ($1, $2, $3)', [req.body.username, req.body.post_id, req.body.comment]).then(function() {
        res.json({
            sucess: true
        });
    }).catch(function(err) {
        console.log(err);
    })
})

app.post('/register', function(req, res) {
    hashingAndChecking.hashPassword(req.body.password).then(function(hashedPass) {
        var query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)';
        var params = [req.body.username, req.body.email, hashedPass];
        var fillUserTable = db.query(query, params);
        return fillUserTable.then(function(data) {
            req.session = {
                username: req.body.username
            }
            res.json({
                success: true
            })
        })
    }).catch(function(err) {
        if (err.detail.startsWith("Key (email)")) {
            res.json({
                err: "Email already exists"
            })
        } else if (err.detail.startsWith("Key (username)")) {
            res.json({
                err: "Username already exists"
            })
        } else {
            console.log(err);
        }
    })
});

app.post('/login', function(req, res) {
    var query = 'SELECT password FROM users WHERE username = $1';
    var params = [req.body.username];
    var getPass = db.query(query, params);
    getPass.then(function(data) {
        console.log(data);
        var checkPass = hashingAndChecking.checkPassword(req.body.password, data.rows[0].password); //typedPass, dbPass
        return checkPass.then(function(data) {
            // if pass match >> data = true
            if (data === true) {
                console.log("password match");
                req.session = {
                    username: req.body.username
                }
                res.json({
                    success: true,
                    session: req.body.username
                })
                console.log("response sent");
            } else if (data === false) {
                console.log("password doesn't match");
                res.json({
                    error: "Password is wrong! Please check and submit again."
                })
            }
        })
    }).catch(function(err) {
        console.log(err);
        res.json({
            error: "Username is not correct!"
        });
    });
});

app.get('*', function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(8080, function() {
    console.log('Listening')
});
