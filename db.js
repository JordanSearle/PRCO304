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
  writeGames: function (id,name,summery,rules,pCount,equipment,nsfw,callback) {
      const game = new schemas.Game({
        //UserID needs to be set from the logged on user.
        userID: mongoose.Types.ObjectId(id),
        game_Name: name,
        game_Summery:summery,
        game_Rules: rules,
        game_Player_Count: pCount,
        game_Equipment: equipment,
        game_IsNSFW:nsfw
     })
     game.save(function (err) {
       if (err) callback(err);
       // thats it!
     });
  },
  nextGame: function (id,callback) {
    var game = schemas.Game;
    game.find({_id: {$gt: id}}).sort({_id:1}).populate('userID','username').limit(1).exec(
      function (err, result) {
        // Tada! random game
        callback(result);
      })
  },
  prevGame: function (id,callback) {
    var game = schemas.Game;
    game.find({_id: {$lt: id}}).sort({_id:-1}).populate('userID','username').limit(1).exec(
      function (err, result) {
        // Tada! random game
        callback(result);
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

  }
}
