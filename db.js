const schemas = require('./schemas.js');
var classes = require('./classes');
var mongoose = require("mongoose");

module.exports = {
  readGames: function (callback) {
    var games = schemas.Game;
    games.find().populate('userID').
    exec(function (err, game) {
      if (err) return err;
      callback(game);
    })
  },
  saveGames: function (id,name,summery,rules,pCount,equipment,nsfw,callback) {
    var game = new classes.game();
    game.game_Name = name;
    game.game_Summery = summery;
    game.game_Rules = rules;
    game.game_Player_Count = pCount;
    game.game_equipment = equipment;
    game.game_IsNSFW = nsfw;
    game.saveGame(id,function (err) {
      if(err)console.log(err);
    })
  },
  getGame: function (name, callback) {
    var game = schemas.Game;
    game.find({game_Name: { $regex: new RegExp("^" + name.toLowerCase(), "i") }}).populate('userID','username').limit(1).exec(
      function (err, result) {
        // Tada! random game
        if(err)callback(err);
        callback(result);
      })
  },
  editGames: function (gameID,name,summery,rules,pCount,equipment,nsfw,callback) {
    var game = new classes.game();
    game.game_UID = gameID;
    game.game_Name = name;
    game.game_Summery = summery;
    game.game_Rules = rules;
    game.game_Player_Count = pCount;
    game.game_equipment = equipment;
    game.game_IsNSFW = nsfw;
    game.updateGame(function (err) {
      if(err)console.log(err);
    })
  },
  delGame: function (gameID,callback) {
    var game = new classes.game();
    game.game_UID = gameID;
    game.delGame(function (err) {
      if(err)callback(err);
    })
  },
  nextGame: function (id,callback) {
    var game = schemas.Game;
    game.find({game_Name:id}).limit(1).exec(function (err, res) {
      game.find({_id: {$gt: res[0]._id}}).sort({_id:1}).populate('userID','username').exec(
        function (err, result) {
          if (result.length==0) {
            callback(res);
          }
          else{
            callback(result);
          }
        })
    })
  },
  prevGame: function (id,callback) {
    var game = schemas.Game;
    game.find({game_Name:id}).limit(1).exec(function (err, res) {
      game.find({_id: {$lt: res[0]._id}}).sort({_id:-1}).populate('userID','username').limit(1).exec(
        function (err, result) {
          if (result.length==0) {
            callback(res);
          }
          else{
            callback(result);
          }
        })
    })

  },
  randomGame: function (callback) {
    var game = schemas.Game;
    game.count().exec(function (err, count) {
      // Get a random entry
      var random = Math.floor(Math.random() * count)
      // Again query all users but only fetch one offset by our random #
      game.findOne().populate('userID','username').skip(random).exec(
        function (err, result) {
          // Tada! random game
          callback(result);
        })
    })
  },
  listBookmarks: function (id,callback) {
    var bm = schemas.Bookmark;
    bm.find({userID:id}).populate('gameID').exec(function (err,res) {
      if(err)callback(err);
      callback(res);
    })
  }
}
