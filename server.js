  var express = require('express');
  var app = express();
  var mongoose = require("mongoose");
  var bodyParser = require('body-parser');


  app.use( bodyParser.json() );       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));
  const uri = 'mongodb://localhost:27017/PRCO304';

  var db = require('./db');
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

  module.exports.server = server;

  app.get('/', function (req, res) {
    res.sendStatus(200);
  })
  app.get('/readgames', function (req, res) {
    db.readGames(function (result) {
      res.send(result);
    })
  })
  app.post('/writegame', function (req, res) {
    db.writeGames(req.body.name,req.body.summery,req.body.rules,req.body.pcount,req.body.equipment,function (err) {
          res.sendStatus(201);
    })
  })
