const server = require('./server').server;
const app = require('./server').app;
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
const uri = 'mongodb://localhost:27017/PRCO304';
var db = require('./db');
var verify = require('./verification');
var classes = require('./classes');
var session = require('express-session')
var expressWs = require('express-ws')(app);

const schemas = require('./schemas.js');


app.get("/", function(req, res) {
  //Checks if the user is logged in
  verify(app,res,req.session.user,function (logged) {
    if (logged) {
      verify.setRoot(app,res,req.session.user,function (logged){

      })
    }
  });
});
app.get('/readgames', function (req, res) {
    db.readGames(function (result) {
      res.send(result);
    })
  })
//Anon Functions
  app.post('/login',function (req,res) {
    //Check the user login
    var user = new classes.user();
    user.setUsername(req.body.username);
    user.setPassword(req.body.password);
    user.validateDetails(function (response) {
      if (response.uID !=null) {
        //If the correct details have been entered
        req.session.user = response.uID;
        verify.setRoot(app,res,response.uID);
      }
      else{
      res.status(201).send(response.status);
      }
    })
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
//Logged in User Functions
  app.get('/logout',function (req,res) {
    req.session.cookie.expires = new Date(Date.now());
    req.session.destroy();
    res.cookie("sessionid", { expires: Date.now() });
    res.redirect('/');
  })
  app.delete('/user',function (req,res) {
    //Delete a User
    //Verifies the user is logged in or not. not logged in will redirect to default index page
    verify(app,res,req.session.user,function (logged) {
      if (logged) {
        //Logged in so do shit.
        //Delete a user
        var user = new classes.user();
        user.setUserID(req.session.user);
        user.delUser(function (response) {
          //Do something here
        })
        req.session.destroy();
        res.sendStatus(201);
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

        });
        res.sendStatus(200);
      }
    });

  })
  app.get('/user',function (req,res) {
    //view user
    //Verifies the user is logged in or not. not logged in will redirect to default index page
    verify(app,res,req.session.user,function (logged) {
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
//Admin functions
  app.post('/newgame',function (req,res) {
    //Check Admin and logged in
    //Add game if true
    db.saveGames(req.session.user,req.body.game_Name,req.body.game_Summery,req.body.game_Rules,req.body.game_Player_Count,req.body.game_Equipment,req.body.game_IsNSFW,function (response) {
      if(response) console.log(response);
    })
    res.sendStatus(201);
  })
  app.put('/editgame',function (req,res) {
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
  app.delete('/delGame',function (req,res) {
    var game = new classes.game();
    game.game_UID = req.body.id;
      game.delGame(function (err) {
        if(err)callback(err);
      })
    res.sendStatus(201);
  })
  app.get('/users',function (req,res) {
    db.getUsers(function (result) {
      res.send(result);
    })
  })
  app.post('/users',function (req,res) {
    //Check if admin
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
  app.delete('/users/:userID',function (req,res) {
    //Check if admin
    var user = new classes.user();
    user.setUserID(req.params.userID);
    user.delUser(function (response) {
      //Do something here
      console.log(response);
    })
    res.sendStatus(201);
  })

  app.post('/pending',function (req,res) {
    //check if logged on user
    verify(app,res,req.session.user,function (logged) {
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
