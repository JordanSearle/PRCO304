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
    var bm = schemas.Bookmark;
    var bookmark = new schemas.Bookmark({
      userID:mongoose.Types.ObjectId(this.userID),
      gameID:mongoose.Types.ObjectId(this.gameID)
    })

    bm.countDocuments({userID:this.userID,gameID:this.gameID}).exec(function (err,count) {
      if (count == 1) {
        bm.deleteOne({userID:userID,gameID:gameID},function (err) {
          callback(err);
        })
      }
      else{
        bookmark.save(function (err) {
          if(err)callback(err);
        })
      }
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
    bookmark.deleteOne({userID:this.userID,gameID:this.gameID},function (err) {
      callback(err);
    })
  }
  addTag(){

  }
  delTag(){

  }
}
