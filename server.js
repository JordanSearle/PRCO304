var express = require('express');
var app = express();
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
const uri = 'mongodb://localhost:27017/PRCO304';
var session = require('express-session')

const schemas = require('./schemas.js');

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
    sameSite:true,
    cookie: {
        expires: 6000000
    }
}));
//Server Start...
var server =  app.listen(9000, function() {
    // Connect to Mongoose.
    mongoose.connect(uri, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then((test) => {
      console.log("%s Connected to DB", new Date());
    });
    var port = server.address().port;
    console.log('%s Listening on port %s', new Date(), port);
  });
module.exports.server = server;
module.exports.app = app;
