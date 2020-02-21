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

  }
  game_UID;
  game_Name;
  game_Summery;
  game_Rules;
  game_Player_Count;
  game_Equipment;
  game_IsNSFW;
  saveGame(callback){
      const game = new schemas.Game({
        //UserID needs to be set from the logged on user.
        _id: new mongoose.Types.ObjectId,
        userID: mongoose.Types.ObjectId(id),
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
    if (err) return handleError(err);
  });
  }
  updateGame(callback){
    var game = this;
    var uGame = schemas.Game;
    uGame.findOne({'_id':this.game_UID},function (err, result) {
      //Set game Variables
      result.game_Name = game.game_Name;
      result.game_Summery = game.game_Summery;
      result.game_Rules = game.game_Rules;
      result.game_Player_Count = game.game_Player_Count;
      result.game_Equipment = game.game_Equipment;
      result.game_IsNSFW = game.game_IsNSFW;
      result.save();
    })
  }
  //Rating function, not important right now.
  calculateRating(){

  }
  addRating(){

  }
  delRating(){

  }
}
