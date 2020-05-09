var db = require('../db.js');
var user = require('./user');
var schemas = require('../schemas');
var mongoose = require("mongoose");
module.exports = class bookmark {
  userID;
  gameID;
  constructor(userID,gameID){
    this.userID = userID;
    this.gameID = gameID;
  }
  addBookmark(callback){
    //write to DB
    var userID = this.userID;
    var gameID = this.gameID;
    var bookmark = new schemas.Bookmark({
      userID:mongoose.Types.ObjectId(userID),
      gameID:mongoose.Types.ObjectId(gameID)
    })

    bookmark.save(function (err,res) {
      callback(err,res);
    })
  }
  viewBookmark(callback){
    var bookmark = schemas.Bookmark;
    bookmark.findOne({userID:this.userID,gameID:this.gameID}).exec(function (err,res) {
      if(err)callabck(err);
      callback(res);
    })
  }
  delBookmark(callback){
    var bookmark = schemas.Bookmark;
    bookmark.deleteOne({userID:this.userID,gameID:this.gameID},function (err,res) {
      callback(err,res);
    })
  }
  addTag(tagName,callback){
      var bookmark = schemas.Bookmark;
      bookmark.findOne({userID:this.userID,gameID:this.gameID}).exec(function (err,res) {
        var tag = {name:tagName}
        res.tags.push(tag);
        res.save(function (err,res) {
          callback(err,res);
        });
      });
  }
  delTag(tagName,callback){
      var bookmark = schemas.Bookmark;
      bookmark.findOne({userID:this.userID,gameID:this.gameID}).exec(function (err,res) {
        var tag = {name:tagName}
        res.tags.pull(tag);
        res.save(function (err,res) {
          callback(err,res);
        });
      });
  }
}
