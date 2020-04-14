var classes = require('./classes');
const mongoose = require('mongoose');
var schemas = require("./schemas");
var verify = require('./verification');
var objectId = require('mongoose').Types.ObjectId;
var db = require('./db');
var session = require('express-session')
var express = require('express');
var app = express();
// Export the functions for each server operation, e.g Post game and get game
module.exports = {
//Unregistered User functions
  default: function (req,res) {
    // This it the app.get '/' function
    verify(req,res,req.session.user,function (logged) {
      if (logged) {
        verify.setRoot(req,res,req.session.user,function (logged){

        })
      }
    });
  },
  login: function (req,res) {
    // This it the app.post /login
    var user = new classes.user();
    user.setUsername(req.body.username);
    user.setPassword(req.body.password);
    user.validateDetails(function (response) {
      if (response.uID !=null) {
        //If the correct details have been entered
        req.session.user = response.uID;
        verify.setRoot(req,res,req.session.user,response.uID);
      }
      else{
      res.status(201).send(response.status);
      }
    })
  },
  user: function (req,res) {
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
  },
  getGame: function (req,res) {
    //This is the app.get /game/:name
    db.getGame(req.params.name,function (result,err) {
        console.log(req.params.name);
      if(result.length ==0 ){
        res.sendStatus(404);
        return;
      }
      else {
        res.send(result);
      }
    })
  },
  nextGame: function (ws,req) {
    //This is the app.ws /game/next
    ws.on('message', function(msg) {
      //Get the next game
      db.nextGame(JSON.parse(msg).name,function (result) {
        //Return result
        ws.send(JSON.stringify(result));
      })
    });
  },
  prevGame: function (ws,req) {
    //This is the app.ws /game/prev
    ws.on('message', function(msg) {
      //get the last game
      db.prevGame(JSON.parse(msg).name, function (result) {
        //Return result
        ws.send(JSON.stringify(result));
      })
    });
  },
  randomGame: function (ws,req) {
    //This is the app.ws /game/random
    ws.on('message', function(msg) {
      //Get a random game
      db.randomGame(function (result) {
      //Return result
        ws.send(JSON.stringify(result));
      })

    });
  },
  loadGame:function (ws,req) {
      //This is the app.ws /game/laod
    ws.on('message', function(msg) {
      //Get a random game
      db.getGame(JSON.parse(msg).name,function (result) {
      //Return result
        ws.send(JSON.stringify(result));
      })

    });
  },
  getGames:function (req,res) {
    db.readGames(function (result) {
      res.send(result);
    })
  },
  //Logged on user and Admin Functions
  logout: function (req,res) {
    //This is the app.get /logout function
    req.session.cookie.expires = new Date(Date.now());
    req.session.destroy();
    res.cookie("sessionid", { expires: Date.now() });
    res.redirect('/');
  },
  delUser: function (req,res) {
    //This is the app.delete /user and /users/userID functions, both are being moved into the same function using abstract factory pattern.
    var fac = new factory();
    fac.create(req.session.user,function (result) {
      if (result == false) {
        //Redirect
        res.redirect('/');
      }
      else{
        result.setUserID(req.session.userID);
        result.delUser(req.params.userID,function (err,response) {
          if(err){
            res.status(500).send(err);
          }
          else{
            res.redirect('/');
          }
        })
      }
    });

  },
  editUser: function (req,res) {
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

  },
  getUser: function (req,res) {
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

  },
  likeGame: function (ws,req) {
        ws.on('message', function(msg) {
          var t = JSON.parse(msg).gameID;
          var gm = new classes.game();
          gm.rate(t,req.session.user,function (err) {
            if(err)console.log(err);
          })
          ws.send(JSON.stringify('done'));
        });
  },
  newBookmark: function (req,res) {
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
  },
  delBookmark:  function (req,res) {
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

  },
  getBookmark: function (req,res) {
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
  },
  getBookmarks: function (req,res) {
    //Get all bookmarks by user return
    db.listBookmarks(req.session.user,function (result) {
      res.send(result);
    })
  },
  tagBookmark: function (req,res) {
    var bm = new classes.bookmark();
    bm.gameID = req.body.gameID;
    bm.userID = req.session.user
    bm.addTag(req.body.tagName,function (err) {
      if(err)console.log(err);
    })
    res.send('ok');
  },
  untagBookmark: function (req,res) {
    var bm = new classes.bookmark();
    bm.gameID = req.body.gameID;
    bm.userID = req.session.user;
    bm.delTag(req.body.tagName,function (err) {
      if(err)console.log(err);
    })
    res.send('ok');
  },
  newGame: function (req,res) {
    //Check Admin and logged in
    //Add game if true
    db.saveGames(req.session.user,req.body.game_Name,req.body.game_Summery,req.body.game_Rules,req.body.game_Player_Count,req.body.game_Equipment,req.body.game_IsNSFW,function (response) {
      if(response) console.log(response);
    })
    res.sendStatus(201);
  },
  editGame: function (req,res) {
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
  },
  delGame: function (req,res) {
    var game = new classes.game();
    game.game_UID = req.body.id;
      game.delGame(function (err) {
        if(err)callback(err);
      })
    res.sendStatus(201);
  },
  returnPending: function (req,res) {
    //This is the app.get /user/pending and /pending functions, both are being moved into the same function using abstract factory pattern.
  },
  delPending: function (req,res) {
    //This is the app.delete /pending/:id function
  },
  savePending:function (req,res) {
    //This is the app.post /pending/save function
  }
}

   class controllerFactory{
     userID;
     constructor(id){
       this.userID = id;
     }
     async temp (id) {
       var levelPromise = new Promise((resolve,reject)=>{
         //Read form database
         var user = schemas.User;
         var searchID;
         if (typeof id === 'undefined'||!objectId.isValid(id)) { searchID = null; }
         else{
           searchID = objectId(id)
         }
         user.findOne({_id:searchID},function (err,result) {
           //check for err and if exist (return undefined if not)
           if(result === null){resolve(undefined)}
           else{
             //check if admin (return true if so)
             var choiceobj = result.toObject();
            if (choiceobj.hasOwnProperty('isAdmin')){
              if (choiceobj.isAdmin == true) {
                resolve(true);
              }else{
                //else (return false)
                resolve(false);
              }
            }
            else{
              //else (return false)
              resolve(false);
            }
           }
         })


       })
         let model = await levelPromise;
         return(model);
     }
     create(id,callback){
       this.temp(id).then(function (result) {
         var user;
         //Switch to correct user
         switch(result) {
             case false:
             //logged on user level
                 user = new classes.user();
                 break;
             case true:
             //Admin user level
                 user = new classes.admin();
                 break;
             default:
               //Default user level if undefined
               user = false;
                 break;
         }
         callback(user);
       })
     }
   }

//For testing
module.exports.factory = controllerFactory;
