var express = require('express');
var app = express();
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var session = require('express-session')
var expressWs = require('express-ws')(app);

var db = require('./db');
var verify = require('./verification');
var classes = require('./classes');

const schemas = require('./schemas.js');
var serverFunctions = require('./serverFunctions');


const uri = 'mongodb://localhost:27017/PRCO304';

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
var server = app.listen(9000, function() {


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

//Default and error handing
    app.get("/", serverFunctions.default);
    app.get('/logout',serverFunctions.logout)
    app.post('/login',serverFunctions.login)
  // /game/ functions
    app.get('/game',serverFunctions.getGames)
    app.get('/game/:name',serverFunctions.getGame)
    //Websocket Functions
    app.ws('/game/next',serverFunctions.nextGame)
    app.ws('/game/prev',serverFunctions.prevGame)
    app.ws('/game/random',serverFunctions.randomGame)
    app.ws('/game/load',serverFunctions.loadGame)
    app.ws('/game/like',serverFunctions.likeGame)
    app.ws('/game/search',serverFunctions.search)
    //User functions
    app.post('/game/bookmark',serverFunctions.newBookmark)
    app.delete('/game/bookmark',serverFunctions.delBookmark)
    app.get('/game/bookmark/:gameID',serverFunctions.getBookmark)
    //Admin Functions
    app.post('/game',serverFunctions.newGame)
    app.put('/game',serverFunctions.editGame)
    app.delete('/game',serverFunctions.delGame)
// /user/ functions
    app.post('/user',serverFunctions.user)
    app.delete('/user',serverFunctions.delUser)
    app.put('/user',serverFunctions.editUser)
    app.get('/user',serverFunctions.getUser)

    app.get('/users',function (req,res) {
      db.getUsers(function (result) {
        res.send(result);
      })
    })

    app.get('/user/bookmarks',serverFunctions.getBookmarks)
    app.post('/user/bookmarks/tag',serverFunctions.tagBookmark)
    app.delete('/user/bookmarks/tag',serverFunctions.untagBookmark)

//redundant functiopns that need merging into above functions


    app.delete('/pending',serverFunctions.delPending)
    app.get('/pending',function (req,res) {
      //Check if admin

      //get all pending request
      var game = schemas.Pending;
      game.find().exec(function (err,result) {
        if(err){
          console.log(err);
          res.status(400).send(err);
        }
        else{
          res.status(200).send(result);
        }
      })
    })
    app.post('/pending/save',serverFunctions.savePending)
    app.get('/user/pending',function (req,res) {
      var game = schemas.Pending;
      game.find({userID:req.session.user}).exec(function (err,result) {
        if(err){
          console.log(err);
          res.status(400).send(err);
        }
        else{
          res.status(200).send(result);
        }
      })
    })
//Test routes
const os = require('os');
var osUtil = require('os-utils');

  app.ws('/adminhome',function (ws,req) {
    ws.on('message', function(msg) {
      osUtil.cpuUsage(function(v){
        if (ws.readyState === 1) {
          sd = {
            cpu: v,
            memm: os.freemem(),
            totalMem: os.totalmem(),
          }
          ws.send(JSON.stringify(sd));
        }
      });
    });
  })
  app.get('/adminhome',function (req,res) {
    var response = {
      op: os.EOL,
      platform: os.platform(),
      release: os.release(),
      arch: os.arch(),
      cpus: os.cpus(),
      memm: os.freemem(),
      totalMem: os.totalmem(),
      host: os.hostname(),
      loadavg: os.loadavg(),
      netintface: os.networkInterfaces(),
      uptime: new Date(os.uptime() * 1000).toISOString().substr(11, 8)
    }
    res.send(response);
  })
  function errorHandler (err, req, res, next) {
    if(req.ws){
        console.error("ERROR from WS route - ", err);
    } else {
        console.error(err);
        res.setHeader('Content-Type', 'text/plain');
        res.status(500).send(err.stack);
    }
}
app.use(errorHandler);
