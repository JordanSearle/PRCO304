var db = require('../db.js');
var user = require('./user');
var schemas = require('../schemas');
var mongoose = require("mongoose");
module.exports = class game {
  constructor(gameID,name,summery,rules,count,equipment,nsfw,categories){
    this.game_UID = gameID;
    this.game_Name = name;
    this.game_Summery = summery;
    this.game_Rules = rules;
    this.game_Player_Count = count;
    this.game_Equipment = equipment;
    this.game_Categories = categories;
    this.game_IsNSFW = nsfw;
    this.game_Rating = 0;
  }
  game_UID; //game id
  game_Name;
  game_Summery;
  game_Rules;
  game_Player_Count;
  game_Equipment;
  game_IsNSFW;
  game_Rating;
  game_Categories;
  saveGame(id,callback){
      const game = new schemas.Game({
        //UserID needs to be set from the logged on user.
        _id: new mongoose.Types.ObjectId,
        userID:  mongoose.Types.ObjectId(id),
        game_Name: this.game_Name,
        game_Summery:this.game_Summery,
        game_Rules: this.game_Rules,
        game_Player_Count: this.game_Player_Count,
        game_Equipment: this.game_Equipment,
        game_IsNSFW:this.game_IsNSFW,
        game_Categories:this.game_Categories
     })
     this.game_UID = game._id;
     game.save(function (err,res) {
       callback(err,res)
     });
  }
  delGame(callback){
    var uGame = schemas.Game;
    uGame.deleteOne({_id:this.game_UID}, function (err,result) {
      callback(err,result);
    });
  }
  updateGame(callback){
    var uGame = schemas.Game;
    uGame.findOne({'_id':this.game_UID},(err, result) =>{
      if(err)callback(err);
      //Set game Variables
      result.game_Name = this.game_Name;
      result.game_Summery = this.game_Summery;
      result.game_Rules = this.game_Rules;
      result.game_Player_Count = this.game_Player_Count;
      result.game_Equipment = this.game_Equipment;
      result.game_IsNSFW = this.game_IsNSFW;
      result.game_Categories = this.game_Categories;
      result.save(function (err,res) {
        callback(err,res)
      });
    })
  }
  //Rating function, not important right now.
  rate(gameID,userID,callback){
    var gm = schemas.Game;
    gm.findOne({
      _id:gameID,
    }).exec(function (err,res) {
        if (res) {
          if (res.rating.length > 0) {
            var data = res.rating.find( function( ele ) {
              return ele.gameID === gameID;
            });
            if( data ) {
              res.rating.forEach((item, i) => {
                if (item.userID == userID) {
                  res.rating.splice(i,1)
                }
              });
              res.ratingCount--;
              res.markModified('rating')
              res.save(function (err,res) {
                callback(err,res)
              })
            }
            else{
              res.rating.push({'userID':userID,'gameID':gameID})
              res.ratingCount++;
              res.markModified('rating')
              res.save(function (err,res) {
                callback(err,res)
              })
            }
          }
          else{
            res.rating.push({'userID':userID,'gameID':gameID});
            res.ratingCount++;
            res.markModified('rating')
            res.save(function (err,res) {
              callback(err,res)
            })
          }
        }
        else{
          callback('Error',null)
        }
    })
  }
  addPending(id,callback){
    const game = new schemas.Pending({
      //UserID needs to be set from the logged on user.
      id: new mongoose.Types.ObjectId,
      userID:  mongoose.Types.ObjectId(id),
      game_Name: this.game_Name,
      game_Summery:this.game_Summery,
      game_Rules: this.game_Rules,
      game_Player_Count: this.game_Player_Count,
      game_Equipment: this.game_Equipment,
      game_IsNSFW:this.game_IsNSFW,
      pending:true
   })
   this.game_UID = game._id;
   game.save(function (err,res) {
     callback(err,res);
   });
  }
  editPending(id,callback){
    var uGame = schemas.Game;
    uGame.findOne({'_id':id},(err, result) =>{
      if(err)callback(err);
      //Set game Variables
      const game = new schemas.Pending({
        id: result._id,
        userID:  result.userID,
        game_Name: this.game_Name,
        game_Summery:this.game_Summery,
        game_Rules: this.game_Rules,
        game_Player_Count: this.game_Player_Count,
        game_Equipment: this.game_Equipment,
        game_IsNSFW:this.game_IsNSFW,
        pending:true
      })
      game.save(function (err,res) {
        callback(err,res);
      });
    })
  }
  approvePending(callback){
    var pending = schemas.Pending;
    pending.findOne({'id':this.game_UID},(err, result) =>{
      if (err == null&&result !=null) {
        var gm = schemas.Game;
        gm.findOne({_id:result.id},(errs,res)=>{
          if (err == null && res !=null) {
            res.game_Name = result.game_Name,
            res.game_Summery=result.game_Summery,
            res.game_Rules= result.game_Rules,
            res.game_Player_Count= result.game_Player_Count,
            res.game_Equipment= result.game_Equipment,
            res.game_IsNSFW=result.game_IsNSFW;
            res.game_Categories = result.game_Categories;
            res.save();
            result.remove();
            callback(errs,res);
          }
          else if(errs==null){
            var game = new schemas.Game({
                _id: this.game_UID,
                userID:  this.userID,
                game_Name: this.game_Name,
                game_Summery:this.game_Summery,
                game_Rules: this.game_Rules,
                game_Player_Count: this.game_Player_Count,
                game_Equipment: this.game_Equipment,
                game_IsNSFW:this.game_IsNSFW,
                game_Categories:this.game_Categories
            })
            game.save( (e,r) => {
              if(e == null)result.remove();
              callback(e,r);
            })
          }
        })
      }
      else if(err){
        callback(err,null);
      }

    })
  }
  denyPending(id,callback){
      var pending = schemas.Pending;
      pending.deleteOne({'id':id},(err,result)=>{
        callback(err,result)
      })
  }
}
