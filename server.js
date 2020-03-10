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

    app.post('/login',function (req,res) {
      //Check the user login
      var user = new classes.user();
      user.setUsername(req.body.username);
      user.setPassword(req.body.password);
      user.validateDetails(function (response) {
        if (response.uID !=null) {
          //If the correct details have been entered
          req.session.user = response.uID;
          app.use(express.static('admin'));
          res.status(200).sendFile("/", {
            root: 'admin'
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
      verify(app,res,req.session.user);
      //Delete a user
      var user = new classes.user();
      user.setUserID(req.session.user);
      user.delUser(function (response) {
        //Do something here
      })
      req.session.destroy();
      res.sendStatus(201);
    })
    app.put('/user',function (req,res) {
      //edit a user
      //Verifies the user is logged in or not. not logged in will redirect to default index page
      verify(app,res,req.session.user);
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
    })
    app.get('/user',function (req,res) {
      //view user
      //Verifies the user is logged in or not. not logged in will redirect to default index page
      verify(app,res,req.session.user);
      //will return the user's data
      var user = new classes.user();
      user.setUserID(req.session.user);
      user.viewUser(function (result) {
        res.send(result);
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
    app.delete('delGame',function (req,res) {
      db.delGame(req.body.id,function (err) {
        if(err)console.log(err);
      })
      req.sendStatus(201);
    })
