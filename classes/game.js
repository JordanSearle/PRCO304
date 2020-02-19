var db = require('../db.js');
var user = require('./user');
module.exports = class game {
  constructor(gameID,name,summery,rules,count,equipment, nsfw){
    this.game_UID = gameID;
    this.game_Name = userID;
    this.game_Summery = summery;
    this.game_Rules = rules;
    this.game_Player_Count = count;
    this.game_Equipment = equipment;
    this.game_IsNSFW = nsfw;
  }
  game_uniqueID;
  game_Name;
  game_Summery;
  game_Rules;
  game_Player_Count;
  game_Equipment;
  game_IsNSFW;
  saveGame(){

  }
  delGame(){

  }
  updateGame(){

  }
  //Rating function, not important right now.
  calculateRating(){

  }
  addRating(){

  }
  delRating(){

  }
}
