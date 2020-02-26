var express = require('express');
var app = express();
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
const uri = 'mongodb://localhost:27017/PRCO304';
var db = require('./db');
var classes = require('./classes');
//Express Setup
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
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
app.use(express.static("anon"));
  app.get("/", function(req, res) {
    res.status(200).sendFile("/", {
      root: "anon"
    });
    /*//Checking which user level is logged in.
    //Would run user validation first
    var ex = 'a';
    //Would Switch roots between different user levels
    switch (ex) {
      //Unregistered user
      case 'a': res.status(200).sendFile("/", {
        root: "anon"
      });
      break;
      //Admin User
      case 'b':
      res.status(200).sendFile("/", {
        root: "admin"
      });
      break;
      //Registered user
      case 'c':
      res.status(200).sendFile("/", {
        root: "user"
      });
        break;
    }*/
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
