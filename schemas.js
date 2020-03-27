const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var user = new Schema({
  username:{type: String, required: true, unique: true},
  password:{type: String, required: true},
  email:{type: String, required: true, unique: true},
  user_DOB:{type: Date, required: true},
  isAdmin:{type: Boolean}
});
var bookmark = new Schema({
  userID:{type: Schema.Types.ObjectId, ref: 'User', required: true},
  gameID:{type: Schema.Types.ObjectId, ref: 'Game', required: true},
  tags:{type:[{}]}
});
var game = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID:{type: Schema.Types.ObjectId, ref: 'User', required: true},
  game_Name:{type: String, required: true, unique: true},
  game_Summery:{type: String, required: true},
  game_Rules:{type: String, required: true},
  game_Player_Count:{type: String, required: true},
  game_Equipment:{type:[]},
  game_IsNSFW:{type:Boolean, required:true},
  rating:[{_id: false, u:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate:{  select: 'username'}, required:true,unique:true}}]
});
var rating = new Schema({
  gameID:{type: Schema.Types.ObjectId, ref: 'Game', required: true},
  userID:{type: Schema.Types.ObjectId, ref: 'User', required: true},
  game_Rating:{type: Number, required: true}
});
var pending = new Schema({
  edit_userID:{type: Schema.Types.ObjectId, ref: 'User', required: true},
  game_Name:{type: String},
  game_Summery:{type: String},
  game_Rules:{type: String},
  game_Player_Count:{type: String},
  game_Equipment:{type:[]}
});
module.exports.User = mongoose.model('User', user);
module.exports.Bookmark = mongoose.model('Bookmark', bookmark);
module.exports.Game = mongoose.model('Game', game);
module.exports.Pending = mongoose.model('Pending', pending);
