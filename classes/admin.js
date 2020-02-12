const user = require('./user');
module.exports = class admin extends user {
  #isAdmin;
  constructor(userID,username,password,email,dob) {
    super(userID,username,password,email,dob);
    this.#isAdmin = true;
  }
  getIsAdmin(){
    return this.#isAdmin;
  }
}
