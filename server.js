var express = require('express');
var app = express();
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var session = require('express-session')
var expressWs = require('express-ws')(app);
var session = require('express-session')

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
    app.ws('/game/like',function (ws,req) {
          ws.on('message', function(msg) {
            var t = JSON.parse(msg).gameID;
            var gm = new classes.game();
            gm.rate(t,req.session.user,function (err) {
              if(err)console.log(err);
            })
            ws.send(JSON.stringify('done'));
          });
    })
    //User functions
    app.post('/game/bookmark',function (req,res) {
      verify(req,res,req.session.user,function (logged) {
        if (logged) {
          var bm = new classes.bookmark()
          bm.userID = req.session.user;
          bm.gameID = req.body.gameID;
          bm.addBookmark(function (err) {
            if(err)console.log(err);
          })
          res.sendStatus(201)
        }
      });
    })
    app.delete('/game/bookmark',function (req,res) {
      verify(req,res,req.session.user,function (logged) {
        if (logged) {
          var bm = new classes.bookmark()
          bm.userID = req.session.user;
          bm.gameID = req.body.gameID;
          bm.delBookmark(function (err) {
            if(err)console.log(err);
          })
          res.sendStatus(200);
        }
      });

    })
    app.get('/game/bookmark/:gameID',function (req,res) {
      verify(req,res,req.session.user,function (logged) {
        if (logged) {
          var bm = new classes.bookmark()
          bm.userID = req.session.user;
          bm.gameID = req.params.gameID;
          bm.viewBookmark(function (result) {
            res.status(200).send(result);
          })
        }
      });
    })
    //Admin Functions
    app.post('/game',function (req,res) {
      //Check Admin and logged in
      //Add game if true
      db.saveGames(req.session.user,req.body.game_Name,req.body.game_Summery,req.body.game_Rules,req.body.game_Player_Count,req.body.game_Equipment,req.body.game_IsNSFW,function (response) {
        if(response) console.log(response);
      })
      res.sendStatus(201);
    })
    app.put('/game/:gameID',function (req,res) {
      //Check Admin and logged in
      //Add game if true
      var game = new classes.game();
      game.game_UID = req.body._id;
      game.game_Name = req.body.game_Name;
      game.game_Rules = req.body.game_Rules;
      game.game_Summery = req.body.game_Summery;
      game.game_IsNSFW = req.body.game_IsNSFW;
      game.game_Equipment = req.body.game_Equipment;
      game.game_Player_Count = req.body.game_Player_Count;
      game.updateGame(function (err) {
        if(err)console.log(err);
      })
      res.sendStatus(201);
    })
    app.delete('/game/:gameID',function (req,res) {
      var game = new classes.game();
      game.game_UID = req.body.id;
        game.delGame(function (err) {
          if(err)callback(err);
        })
      res.sendStatus(201);
    })
// /user/ functions
    app.post('/user',function (req,res) {
      //create a new user
      var user = new classes.user();
      user.setUsername(req.body.username);
      user.setPassword(req.body.password);
      user.setEmail(req.body.email);
      user.setDOB(req.body.user_DOB);
      user.addUser(function (err) {
        //do somehting with error.
        console.log(err);
      })
      res.sendStatus(201);//Correct Status?
    })
    app.delete('/user/:userID',serverFunctions.delUser)
    app.put('/user/:userID',function (req,res) {
      //edit a user
      //Verifies the user is logged in or not. not logged in will redirect to default index page
      verify(req,res,req.session.user,function (logged) {
        if (logged) {
          //Delete a user
          var user = new classes.user();
          user.setUserID(req.session.user);
          user.setUsername(req.body.username);
          user.setEmail(req.body.email);
          user.setPassword(req.body.password);
          user.setDOB(req.body.user_DOB);
          user.editUser(function(err) {

          });
          res.sendStatus(200);
        }
      });

    })
    app.get('/user',function (req,res) {
      //view user
      //Verifies the user is logged in or not. not logged in will redirect to default index page
      verify(req,res,req.session.user,function (logged) {
        if (logged) {
          //will return the user's data
          var user = new classes.user();
          user.setUserID(req.session.user);
          user.viewUser(function (result) {
            res.send(result);
          })
        }
      });

    })
    app.get('/users',function (req,res) {
      db.getUsers(function (result) {
        res.send(result);
      })
    })

    app.get('/user/bookmarks',function (req,res) {
      //Get all bookmarks by user return
      db.listBookmarks(req.session.user,function (result) {
        res.send(result);
      })
    })
    app.post('/user/bookmarks/tag',function (req,res) {
      var bm = new classes.bookmark();
      bm.gameID = req.body.gameID;
      bm.userID = req.session.user
      bm.addTag(req.body.tagName,function (err) {
        if(err)console.log(err);
      })
      res.send('ok');
    })
    app.delete('/user/bookmarks/tag',function (req,res) {
      var bm = new classes.bookmark();
      bm.gameID = req.body.gameID;
      bm.userID = req.session.user;
      bm.delTag(req.body.tagName,function (err) {
        if(err)console.log(err);
      })
      res.send('ok');
    })

//redundant functiopns that need merging into above functions





    app.post('/pending',function (req,res) {
      //check if logged on user
      verify(req,res,req.session.user,function (logged) {
        if (logged) {
          //Create a new pending request
          var game = new classes.game();
          console.log(req.body);
          game.game_Name = req.body.game_Name;
          game.game_Rules = req.body.game_Rules;
          game.game_Summery = req.body.game_Summery;
          game.game_IsNSFW = req.body.game_IsNSFW;
          game.game_Equipment = req.body.game_Equipment;
          game.game_Player_Count = req.body.game_Player_Count;
          game.addPending(req.session.user,function (err) {
            if(err)console.log(err);
          })
          res.sendStatus(201);
        }
      });

    })
    app.put('/pending',function (req,res) {
      //Make a pending request for game edit (may be moved to /game functions)
    })
    app.delete('/pending/:id',function (req,res) {
      //Check if admin

      //Deny a pending request
      var game = new classes.game();
      //Check if correct ID
      game.denyPending(req.params.id,function (err,result) {
        if(err){
          console.log(err);
          res.status(400).send(err);
        }
        else{
          res.sendStatus(200);
        }
      })
    })
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
    app.get('/pending/:id',function (req,res) {
      //Get specific pending request
      var game = schemas.Pending;
      game.findOne({_id:req.params.id}).exec(function (err,result) {
        if(err){
          res.status(400).send(err);
        }
        else{
          res.status(200).send(result);
        }
      })
    })
    app.post('/pending/save',function (req,res) {
      //Approve a pending request
      var game = new classes.game();
      game.game_Name = req.body.game_Name;
      game.approvePending(function (err,result) {
        if(err!=null){
          res.status(400).send(err);
        }
        else{
          res.sendStatus(200);
        }
      })
    })
    app.put('/pending/:name',function (req,res) {
      //edit a pending request
      var game = new classes.game();
      game.game_Name = req.params.game_Name;
      game.approvePending(function (err,result) {
        if(err){
          res.status(400).send(err);
        }
        else{
          res.sendstatus(200);
        }
      })
    })
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
