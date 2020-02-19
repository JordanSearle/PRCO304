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


  }
}
