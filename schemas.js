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

});
var equipment = new Schema({});
var rating = new Schema({});
var pending = new Schema({});
var pEquipment = new Schema({});
module.exports.User = user;
