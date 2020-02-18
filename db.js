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
  writeGames: function (callback) {
    const user = new schemas.User({
      _id: new mongoose.Types.ObjectId(),
      username: 'JTest',
      password: '12312jhsdf',
      email: 'email@email.com',
      user_DOB: new Date()
    })
       const game = new schemas.Game({
         //UserID needs to be set from the logged on user.
         userID: user._id,
         game_Name: 'New Gamess',
         game_Summery:'This is a test game summery.',
         game_Rules: 'This is a test game rule.',
         game_Player_Count: '1-8 Players',
         game_Equipment: ['test','test2']
      })
      game.save(function (err) {
        if (err) callback(err);
        // thats it!
      });
  }
}
