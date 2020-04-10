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
    // This is the app.post /createuser and Admin /user functions, both are being moved into the same function using abstract factory pattern.
  },
  getGame: function (req,res) {
    //This is the app.get /game/:name
    db.getGame(req.params.name,function (result,err) {
      if(result.length ==0 ){
        res.sendStatus(404);
        return;
      }
      res.send(result);
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
  }
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
    //This is the app.put /user and /users/userID functions, both are being moved into the same function using abstract factory pattern.
  },
  getUser: function (req,res) {
    //This is the app.get /user and /users/userID functions, both are being moved into the same function using abstract factory pattern.
  },
  likeGame: function (ws,req) {
  //This is the ws.get /game/like function
  },
  newBookmark: function (req,res) {
    //This is the app.post /game/bookmark function
  },
  delBookmark: function (req,res) {
    //This is the app.delete /game/bookmark function
  },
  getBookmark: function (req,res) {
    //This is the app.get /game/bookmark/id function
    //May be redundant
  },
  getBookmarks: function (req,res) {
    //This is the app.get /game/bookmarks function
  },
  tagBookmark: function (req,res) {
    //This is the app.post /game/bookmark/tag function
  },
  untagBookmark: function (req,res) {
    //This is the app.delete /game/bookmark/tag function
  },
  newGame: function (req,res) {
    //This is the app.post /newgame and /pending functions, both are being moved into the same function using abstract factory pattern.

  },
  editGame: function (req,res) {
    //This is the app.put /editgame and /pending functions, both are being moved into the same function using abstract factory pattern.

  },
  delGame: function (req,res) {
    //This is the app.delete /delGame function
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
