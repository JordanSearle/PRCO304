var express = require('express');
var app = express();
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
const uri = 'mongodb://localhost:27017/PRCO304';
var db = require('./db');
var verify = require('./verification');
var classes = require('./classes');
var session = require('express-session')
var expressWs = require('express-ws')(app);
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
    app.put('/user/:userID',serverFunctions.editUser)
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

    app.get('/logout',function (req,res) {
      req.session.cookie.expires = new Date(Date.now());
      req.session.destroy();
      res.cookie("sessionid", { expires: Date.now() });
      res.redirect('/');
    })
    app.post('/createuser',function (req,res) {
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
    app.delete('/user',function (req,res) {
      //Delete a User
      //Verifies the user is logged in or not. not logged in will redirect to default index page
      verify(app,res,req.session.user,function (logged) {
        if (logged) {
          //Create a new pending request
          var gm = schemas.Game;
          gm.find({_id:req.body._id}).then(function (result) {
            if(result.length > 0){
              var game = new classes.game();
              game.game_Name = req.body.game_Name;
              game.game_Rules = req.body.game_Rules;
              game.game_Summery = req.body.game_Summery;
              game.game_IsNSFW = req.body.game_IsNSFW;
              game.game_Equipment = req.body.game_Equipment;
              game.game_Player_Count = req.body.game_Player_Count;
              game.editPending(req.body._id,function (err) {
                if(err)console.log(err);
              })
              res.sendStatus(201);
            }
            else{
              var game = new classes.game();
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
          })

        }
      });

    })
    app.put('/user',function (req,res) {
      //edit a user
      //Verifies the user is logged in or not. not logged in will redirect to default index page
      verify(app,res,req.session.user,function (logged) {
        if (logged) {
          //Delete a user
          var user = new classes.user();
          user.setUserID(req.session.user);
          user.setUsername(req.body.username);
          user.setEmail(req.body.email);
          user.setPassword(req.body.password);
          user.setDOB(req.body.user_DOB);
          user.editUser(function(err) {

    app.delete('/pending',function (req,res) {
      //Check if admin

      //Deny a pending request
      var game = new classes.game();
      //Check if correct ID-
      game.denyPending(req.body.gameID,function (err,result) {
        if(err){
          res.status(400).send(err);
        }
      });

    })
    app.get('/game/:name',function (req,res) {
      //Get game from ID and return
      db.getGame(req.params.name,function (result,err) {
        if(result.length ==0 ){
          res.sendStatus(404);
          return;
        }
        res.send(result);
      })
    })
    app.ws('/game/next',function (ws,req) {
      ws.on('message', function(msg) {
        //Get the next game
        db.nextGame(JSON.parse(msg).name,function (result) {
          //Return result
          ws.send(JSON.stringify(result));
        })
      });
    })
    app.ws('/game/prev',function (ws,req) {
      ws.on('message', function(msg) {
        //get the last game
        db.prevGame(JSON.parse(msg).name, function (result) {
          //Return result
          ws.send(JSON.stringify(result));
        })
      });
    })
    app.ws('/game/random',function (ws,req) {
      ws.on('message', function(msg) {
        //Get a random game
        db.randomGame(function (result) {
        //Return result
          ws.send(JSON.stringify(result));
        })

      });
    })
    app.ws('/game/load',function (ws,req) {
      ws.on('message', function(msg) {
        //Get a random game
        db.getGame(JSON.parse(msg).name,function (result) {
        //Return result
          ws.send(JSON.stringify(result));
        })

      });
    })
    //Admin functions
    app.post('/newgame',function (req,res) {
      //Check Admin and logged in
      //Add game if true
      db.saveGames(req.session.user,req.body.name,req.body.summary,req.body.rules,req.body.pCount,req.body.equipment,req.body.nsfw,function (response) {
        if(response) console.log(response);
      })
      res.sendStatus(201);
    })
    app.put('/editgame',function (req,res) {
      //Check Admin and logged in
      //Add game if true
      db.editGames(req.body.id,req.body.name,req.body.summery,req.body.rules,req.body.pCount,req.body.equipment,req.body.nsfw,function (response) {
        if(response) console.log(response);
      })
      res.sendStatus(201);
    })
    app.delete('/delGame',function (req,res) {
      db.delGame(req.body.id,function (err) {
        if(err)console.log(err);
      })
      req.sendStatus(201);
    })
    app.post('/game/bookmark',function (req,res) {
      verify(app,res,req.session.user,function (logged) {
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
      verify(app,res,req.session.user,function (logged) {
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
      verify(app,res,req.session.user,function (logged) {
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
    app.get('/user/bookmarks',function (req,res) {
      //Get all bookmarks by user return
      db.listBookmarks(req.session.user,function (result) {
        res.send(result);
      })
    })
//Test routes
