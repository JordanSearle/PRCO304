var mongoose = require('mongoose');
var user = new Schema({
  username:{type: String, required: true, unique: true},
  password:{type: String, required: true},
  email:{type: String, required: true, unique: true},
  user_DOB:{type: Date, required: true},
  isAdmin:{type: Boolean}
});
var bookmark = new Schema({});
var tag = new Schema({});
var game = new Schema({
  userID:{type: String, required: true, unique: true},
  game_Name:{type: String, required: true},
  game_Summery:{type: String, required: true},
  game_Rules:{type: String, required: true},
  game_Player_Count:{type: String, required: true},
  game_Creator:{type: String, required: true},
});
var equipment = new Schema({});
var rating = new Schema({});
var pending = new Schema({});
var pEquipment = new Schema({});
module.exports.User = user;
