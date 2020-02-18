  var express = require('express');
  var app = express();
  var mongoose = require("mongoose");
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

  module.exports = server;

  app.get('/', function (req, res) {
    db.writeGames(function (err) {
      if (err) console.log(err);
    });
    db.readGames(function(result) {
      res.send(result);
    })
  })
