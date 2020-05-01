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
    //create a new users
    if (!req.body.hasOwnProperty('username')||!req.body.hasOwnProperty('password')||!req.body.hasOwnProperty('email')||!req.body.hasOwnProperty('user_DOB')|| Object.keys(req.body).length === 0) {
      if(err){res.status(400).send('An Error Occurred')}
    }
    else {
      var fac = new controllerFactory();
      fac.create(req.session.user,function (result) {
        if (result instanceof classes.admin ) {
          result.setIsAdmin(req.body.isAdmin)
        }
        else if (result == false) {
          result = new classes.user();
        }
        result.setUsername(req.body.username);
        result.setPassword(req.body.password);
        result.setEmail(req.body.email);
        result.setDOB(req.body.user_DOB);
        result.addUser(function (err,response) {
          //do somehting with error.
          if(err){res.status(400).send(err)}
          else{res.sendStatus(201)}//Correct Status?
        })
      })
    }
  },//Added Input validation
  getGame: function (req,res) {
    //This is the app.get /game/:name
    if (!req.params.hasOwnProperty('name') || Object.keys(req.params).length === 0) {
      res.sendStatus(400)
    }
    else{
      db.getGame(req.params.name,function (result,err) {
        if(result.length ==0 ){
          res.sendStatus(404);
          return;
        }
        else {
          res.send(result);
        }
      })
    }
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
    var fac = new controllerFactory();
    fac.create(req.session.user,function (result) {
      if (result == false || !req.body.hasOwnProperty('userID')||Object.keys(req.body).length === 0) {
        //Redirect
        res.redirect(403);
      }
      else{
        result.setUserID(req.session.user);
        result.delUser(req.body.userID,function (err,response) {
          if(err){
            res.status(500).send(err);
          }
          else{
            res.status(200).send('ok');
          }
        })
      }
    });

  }, //Updated to Fac controller
  editUser: function (req,res) {
      var fac = new controllerFactory();
      fac.create(req.session.user,function (user) {
        if (user == false) {
          res.redirect(403);
        }
        else {
          user.setUserID(req.session.user);
          if (req.body.hasOwnProperty('password') && Object.keys(req.body.password > 0)) {
            user.setPassword(req.body.password);
          }
          user.editUser(req.body,function(err,response) {
            if(err){res.status(400).send('An Error Occurred');}
            else{res.status(200).send('updated');}
          });
        }
      })
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
          var fac = new controllerFactory();
          var t = JSON.parse(msg)
          fac.create(req.session.user,function (result) {
            if (result instanceof classes.user && t.hasOwnProperty('gameID') && Object.keys(t).length > 0) {
              var gm = new classes.game();
              gm.rate(t.gameID,req.session.user,function (err) {
                if(err)console.log(err);
              })
              ws.send(JSON.stringify('done'));
            }
            else {
                ws.send(JSON.stringify('Forbidden'));
              }
            })
        });

  },
  newBookmark: function (req,res) {
    var fac = new controllerFactory();
    fac.create(req.session.user,function (result) {
      if (result instanceof classes.user && req.body.hasOwnProperty('gameID') && Object.keys(req.body).length > 0) {
        var bm = new classes.bookmark()
        bm.userID = req.session.user;
        bm.gameID = req.body.gameID;
        bm.addBookmark(function (err) {
          if(err)console.log(err);
        })
        res.sendStatus(201)
      }
      else {
          res.sendStatus(403);
        }
      })
  },
  delBookmark:  function (req,res) {
    var fac = new controllerFactory();
    fac.create(req.session.user,function (result) {
      if (result instanceof classes.user && req.body.hasOwnProperty('gameID') && Object.keys(req.body).length > 0) {
        var bm = new classes.bookmark()
        bm.userID = req.session.user;
        bm.gameID = req.body.gameID;
        bm.delBookmark(function (err) {
          if(err)console.log(err);
        })
        res.sendStatus(200);
      }
      else {
          res.sendStatus(403);
        }
      })
  },
  getBookmark: function (req,res) {
    var fac = new controllerFactory();
    fac.create(req.session.user,function (result) {
      if (result instanceof classes.user &&  req.params.hasOwnProperty('gameID') && Object.keys(req.body).length > 0) {
        var bm = new classes.bookmark()
        bm.userID = req.session.user;
        bm.gameID = req.params.gameID;
        bm.viewBookmark(function (result) {
          res.status(200).send(result);
        })
      }
      else {
          res.sendStatus(403);
        }
      })
  },
  getBookmarks: function (req,res) {
    //Get all bookmarks by user return
    var fac = new controllerFactory();
    fac.create(req.session.user,function (result) {
      if (result instanceof classes.user) {
        db.listBookmarks(req.session.user,function (result) {
          res.send(result);
        })
      }
      else {
          res.sendStatus(403);
        }
      })
  },
  tagBookmark: function (req,res) {
    var fac = new controllerFactory();
    fac.create(req.session.user,function (result) {
      if (result instanceof classes.user &&  req.params.hasOwnProperty('gameID')&&  req.params.hasOwnProperty('tagName') && Object.keys(req.body).length > 0) {
        var bm = new classes.bookmark();
        bm.gameID = req.body.gameID;
        bm.userID = req.session.user
        bm.addTag(req.body.tagName,function (err) {
          if(err)console.log(err);
        })
        res.send('ok');
      }
      else {
          res.sendStatus(403);
        }
      })
  },
  untagBookmark: function (req,res) {
    var fac = new controllerFactory();
    fac.create(req.session.user,function (result) {
      if (result instanceof classes.user &&  req.params.hasOwnProperty('gameID')&&  req.params.hasOwnProperty('tagName') && Object.keys(req.body).length > 0) {
        var bm = new classes.bookmark();
        bm.gameID = req.body.gameID;
        bm.userID = req.session.user;
        bm.delTag(req.body.tagName,function (err) {
          if(err)console.log(err);
        })
        res.send('ok');
      }
      else {
          res.sendStatus(403);
        }
      })

  },
  newGame: function (req,res) {
    if (!req.body.hasOwnProperty('game_Name')||!req.body.hasOwnProperty('game_Summery')||!req.body.hasOwnProperty('game_Rules')||!req.body.hasOwnProperty('game_Player_Count')||!req.body.hasOwnProperty('game_Equipment')||!req.body.hasOwnProperty('game_IsNSFW')||!req.body.hasOwnProperty('game_Categories')) {
      res.sendStatus(400)
    }
    else{
      var fac = new controllerFactory();
      fac.create(req.session.user,function (result) {
        if (result == false) {
          res.redirect(403);
        }
        else {
          result.setUserID(req.session.user);
          result.addGame(req.session.user,req.body.game_Name,req.body.game_Summery,req.body.game_Rules,req.body.game_Player_Count,req.body.game_Equipment,req.body.game_IsNSFW,req.body.game_Categories,function (err,response) {
          res.sendStatus(201);
          })
        }
      })
    }
  },  //Updated to Fac controller
  editGame: function (req,res) {
    var fac = new controllerFactory();
    fac.create(req.session.user,function (result) {
      if (result == false || !req.body.hasOwnProperty('game_Name')||!req.body.hasOwnProperty('game_Summery')||!req.body.hasOwnProperty('game_Rules')||!req.body.hasOwnProperty('game_Player_Count')||!req.body.hasOwnProperty('game_Equipment')||!req.body.hasOwnProperty('game_IsNSFW')||!req.body.hasOwnProperty('game_Categories')) {
        res.redirect(403);
      }
      else {
        result.setUserID(req.session.user);
        result.editGame(req.body,function (err,response) {
        res.sendStatus(201);
        })
      }
    })
  },  //Updated to Fac controller
  delGame: function (req,res) {
    var fac = new controllerFactory();
    fac.create(req.session.user,function (result) {
      if (result instanceof classes.admin && req.body.hasOwnProperty('id')) {
        var game = new classes.game();
        game.game_UID = req.body.id;
          game.delGame(function (err) {
            if(err)callback(err);
          })
        res.sendStatus(201);
      }
      else {
          res.sendStatus(403);
        }
      })
  },
  returnPending: function (req,res) {
    //This is the app.get /user/pending and /pending functions, both are being moved into the same function using abstract factory pattern.
  },
  delPending: function (req,res) {
    //Check if admin
    var fac = new controllerFactory();
    fac.create(req.session.user,function (result) {
      if (result instanceof classes.admin && req.body.hasOwnProperty('gameID')) {
        var game = new classes.game();
        //Check if correct ID-
        game.denyPending(req.body.gameID,function (err,result) {
          if(err){
            res.status(400).send(err);
          }
          else{
            res.sendStatus(200);
          }
        })
      }
      else {
          res.sendStatus(403);
        }
      })
    //Deny a pending request

  },
  savePending:function (req,res) {
    //Approve a pending request
    var fac = new controllerFactory();
    fac.create(req.session.user,function (result) {
      if (result instanceof classes.admin && req.body.hasOwnProperty('id') && req.body.hasOwnProperty('userID') && req.body.hasOwnProperty('game_Name') && req.body.hasOwnProperty('game_Summery') && req.body.hasOwnProperty('game_Rules') && req.body.hasOwnProperty('game_Player_Count') && req.body.hasOwnProperty('game_Equipment') && req.body.hasOwnProperty('game_IsNSFW') && req.body.hasOwnProperty('game_Categories')) {
        var game = new classes.game();
        game.game_UID = req.body.id;
        game.userID = req.body.userID;
        game.game_Categories = req.body.game_Categories;
        game.game_Equipment = req.body.game_Equipment;
        game.game_Summery = req.body.game_Summery;
        game.game_Name = req.body.game_Name;
        game.game_Rules = req.body.game_Rules;
        game.game_Player_Count = req.body.game_Player_Count;
        game.game_IsNSFW = req.body.game_IsNSFW;

        game.approvePending(function (err,result) {
          if(err!=null){
            res.status(400).send(err);
          }
          else{
            res.sendStatus(200);
          }
        })
      }
      else {
          res.sendStatus(403);
        }
      })
  },
  search:function (ws,req) {
    ws.on('message', function(msg) {
      var t = JSON.parse(msg).name;
      var rex = new RegExp(t, 'i');
      var s = schemas.Game;
      s.find({$or:[{game_Name:rex},{game_Summery:rex},{game_Rules:rex},{game_Player_Count:rex}]})
           .limit(10)
           .sort( { game_Name: -1 } )
           .exec(function(err, docs) {
             ws.send(JSON.stringify(docs));
           });
    });
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
