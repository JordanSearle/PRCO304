var db = require('../db.js');
const game = require('./game');
var schemas = require('../schemas');
var mongoose = require("mongoose");

module.exports = class pending extends game {
  constructor(gameID,name,summery,rules,count,equipment, nsfw,game_Categories){
    super(gameID,name,summery,rules,count,equipment, nsfw,game_Categories);
    this.game_UID = gameID;
    this.game_Name = name;
    this.game_Summery = summery;
    this.game_Rules = rules;
    this.game_Player_Count = count;
    this.game_Equipment = equipment;
    this.game_IsNSFW = nsfw;
    this.game_Rating = 0;
    this.game_Categories = game_Categories;
  }
  saveGame(id,callback){
      const game = new schemas.Pending({
        //UserID needs to be set from the logged on user.
        _id: new mongoose.Types.ObjectId,
        id:new mongoose.Types.ObjectId,
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
       console.log(err+res);
       callback(err,res)
     });
  }
}
