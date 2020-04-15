const user = require('./user');
var schemas = require("../schemas");
const classes = require('../classes');
module.exports = class admin extends user {
  #isAdmin;
  constructor(userID,username,password,email,dob) {
    super(userID,username,password,email,dob);
    this.#isAdmin = true;
  }
  isAdmin(callback){
    var user = schemas.User;
    user.findOne({'_id':this.getUserID()},function (err, result) {
      if (result.isAdmin == true) {
        callback(true);
      }
      else{
        callback(false);
      }
    })
  }
  addUser(isAdmin,callback){
    //Create new user
    var user = new schemas.User({
      username: this.getUsername(),
      password: this.getPassword(),
      email:this.getEmail(),
      user_DOB:this.getDOB(),
      isAdmin:isAdmin
    })
    user.save(function (err) {
      if(err)callback(err);
    })
  }
  delUser(userID,callback){
    //delete current user
    if (userID) {
      var user = schemas.User;
      user.deleteOne({'_id':userID},function (err,res) {
        callback(err,res)
      })
    }
    else{
      var err = 'request not valid',res = false;
      callback(err,res);
    }

  }
  addGame(game_name,game_Summery,game_Rules,game_Player_Count,game_Equipment,game_IsNSFW,callback) {
    //add a new pending game
    var game = new classes.game();
    game.game_Name=game_name;
    game.game_Summery=game_Summery;
    game.game_Rules=game_Rules;
    game.game_Player_Count=game_Player_Count;
    game.game_Equipment=game_Equipment;
    game.game_IsNSFW = game_IsNSFW;
    game.saveGame(this.getUserID(),function (err,res) {
      callback(err,res)
    })
  }
}
