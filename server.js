var express = require('express');
var app = express();
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
const uri = 'mongodb://localhost:27017/PRCO304';
var db = require('./db');
var verify = require('./verification');
var classes = require('./classes');
var session = require('express-session')
//Express Setup
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(session({
    key: 'sessionid',
    secret: 'tGUpeHR8VribHl8G3kU6',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
//Server Start...
var server = app.listen(9000, function() {
    // Connect to Mongoose.
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then((test) => {
      console.log("%s Connected to DB", new Date());
    });
    var port = server.address().port;
    console.log('%s Listening on port %s', new Date(), port);
  });

  app.get("/", function(req, res) {
    //Checks if the user is logged in
    verify.rootCheck(app,res,req.session.user);
  });
    app.get('/readgames', function (req, res) {
      db.readGames(function (result) {
        res.send(result);
      })
    })
    app.post('/writegame', function (req, res) {
      var game = new classes.game('data','test game name','test game summery','test game rules','test game count', 'test equipment',false);
      game.saveGame(new mongoose.Types.ObjectId,function (err) {
        if(err)console.log(err);
      })
      res.sendStatus(201);
    })
    app.post('/login',function (req,res) {
      //Check the user login
      var user = new classes.user();
      user.setUsername(req.body.username);
      user.setPassword(req.body.password);
      user.validateDetails(function (response) {
        if (response.uID !=null) {
          //If the correct details have been entered
          req.session.user = response.uID;
          app.use(express.static('user'));
          res.status(200).sendFile("/", {
            root: 'user'
          });
        }
        else{
        res.status(201).send(response.status);
        }
      })
    })

    app.get('/logout',function (req,res) {
      req.session.destroy();
      res.redirect('/');
    })
    app.get('/user',function (req,res) {
      //Verifies the user is logged in or not. not logged in will redirect to default index page
      verify(app,res,req.session.user);
      //will return the user's data
      var user = new classes.user();
      user.setUserID(req.session.user);
      user.viewUser(function (result) {
        res.send(result);
      })
    })
