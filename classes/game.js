var db = require('../db.js');
var user = require('./user');
var schemas = require('../schemas');
var mongoose = require("mongoose");
module.exports = class game {
  constructor(gameID,name,summery,rules,count,equipment, nsfw){
    this.game_UID = gameID;
    this.game_Name = name;
    this.game_Summery = summery;
    this.game_Rules = rules;
    this.game_Player_Count = count;
    this.game_Equipment = equipment;
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
        game_IsNSFW:this.game_IsNSFW
     })
     this.game_UID = game._id;
     game.save(function (err) {
       if(err)callback(err);
     });
  }
  delGame(callback){
    var uGame = schemas.Game;
    uGame.deleteOne({'_id':this.game_UID}, function (err) {
    if (err) callback(err);
  });
  }
  updateGame(callback){
    var game = this;
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
      result.save();
    })
  }
  //Rating function, not important right now.
  addRating(userID,callback){
    var game = this;
    var uGame = schemas.Game;
    uGame.findOne({'_id':this.game_UID},(err, result)=> {
      if(err)callback(err);
      //Set game Variables
      result.rating.push({u:userID});
      result.save();
    })
  }
  calculateRating(){
    this.game_Rating = 0;
    var uGame = schemas.Game;
        uGame.findOne({'_id':this.game_UID},(err, result) => {
          //Set game Variables
          if (result.rating.length > 0) {
            this.game_Rating = result.rating.length;
          }
      })
  }
  delRating(userID,callback){
    var uGame = schemas.Game;
    uGame.findOne({'_id':this.game_UID},(err, result) => {
      if(err)callback(err);
      //Set game Variables
      result.rating.pull({u:userID});
      result.save();
    }).then(()=> {
      this.calculateRating(function (err) {
        if(err)console.log(err);
      })
    })
  }
}
