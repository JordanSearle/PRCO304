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
}
