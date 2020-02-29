const user = require('./user');
var schemas = require("../schemas");
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
  addUser(callback){
    //Create new user
    var user = new schemas.User({
      username: this.getUsername(),
      password: this.getPassword(),
      email:this.getEmail(),
      user_DOB:this.getDOB(),
      isAdmin:true
    })
    user.save(function (err) {
      if(err)callback(err);
    })
  }
}
