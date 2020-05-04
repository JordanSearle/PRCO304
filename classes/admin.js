const user = require('./user');
var schemas = require("../schemas");
const classes = require('../classes');
module.exports = class admin extends user {
  #isAdmin;
  constructor(userID,username,password,salt,email,dob) {
    super(userID,username,password,salt,email,dob);
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
  addUser(callback){
    var secure = new classes.secure();
    var saltHash = secure.saltNewHashPassword(this.getPassword());
    //Create new user
    var user = new schemas.User({
      username: this.getUsername(),
      password: saltHash.passwordHash,
      salt:saltHash.salt,
      email:this.getEmail(),
      user_DOB:this.getDOB(),
      isAdmin:this.getIsAdmin()
    })
    user.save(function (err,res) {
    callback(err,res);
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
  addGame(id,game_Name,game_Summery,game_Rules,game_Player_Count,game_Equipment,game_IsNSFW,game_Categories,callback) {
    //add a new pending game
    var game = new classes.game();
    game.game_Name=game_Name;
    game.game_Summery=game_Summery;
    game.game_Rules=game_Rules;
    game.game_Player_Count=game_Player_Count;
    game.game_Equipment=game_Equipment;
    game.game_IsNSFW = game_IsNSFW;
    game.game_Categories = game_Categories;
    game.saveGame(this.getUserID(),function (err,res) {
      callback(err,res)
    })
  }
  editGame(gameJSON,callback){
    var game = new classes.game();
    game.game_UID = gameJSON._id;
    game.game_Name=gameJSON.game_Name;
    game.game_Summery=gameJSON.game_Summery;
    game.game_Rules=gameJSON.game_Rules;
    game.game_Player_Count=gameJSON.game_Player_Count;
    game.game_Equipment=gameJSON.game_Equipment;
    game.game_IsNSFW = gameJSON.game_IsNSFW;
    game.game_Categories = gameJSON.game_Categories;
    game.updateGame(function (err,res) {
      callback(err,res)
    })
  }
  setIsAdmin(admin){
    this.#isAdmin = admin;
  }
  getIsAdmin(){
    return this.#isAdmin;
  }
}
