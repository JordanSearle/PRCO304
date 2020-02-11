var mongoose = require('mongoose');
var user = new Schema({
  username:{type: String, required: true, unique: true},
  password:{type: String, required: true},
  email:{type: String, required: true, unique: true},
  user_DOB:{type: Date, required: true},
  isAdmin:{type: Boolean}
});
var bookmark = new Schema({
  bookmarkID:{type: String, required: true, unique: true},
  userID:{type: String, required: true},
  gameID:{type: String, required: true, unique: true},
});
var tag = new Schema({
  bookmarkTag:{type: String, required: true, unique: true},
  bookmarkID:{type: String, required: true}
});
var game = new Schema({
  userID:{type: String, required: true},
  game_Name:{type: String, required: true},
  game_Summery:{type: String, required: true},
  game_Rules:{type: String, required: true},
  game_Player_Count:{type: String, required: true},
  game_Creator:{type: String, required: true}
});
var equipment = new Schema({
  gameID:{type: String, required: true},
  game_Equipment:{type: String, required: true}
});
var rating = new Schema({
  gameID:{type: String, required: true},
  game_Rating:{type: Number, required: true}
});
var pending = new Schema({
  userID:{type: String, required: true},
  game_Name:{type: String},
  game_Summery:{type: String},
  game_Rules:{type: String},
  game_Player_Count:{type: String},
  game_Creator:{type: String}
});
var pEquipment = new Schema({
  pendingID:{type: String,required: true},
  game_Equipment:{type: String}
});
module.exports.User = user;
module.exports.Bookmark = bookmark;
module.exports.Tag = tag;
module.exports.Game = game;
module.exports.Equipment = equipment;
module.exports.Rating = rating;
module.exports.Pending = pending;
module.exports.PEquipment = pEquipment;
