class user{
    #userID;
    #username;
    #password;
    #email;
    #user_DOB;
    constructor(ID,username,password,email,dob){
      this.#userID = ID;
      this.#username = username;
      this.#password = password;
      this.#email = email;
      this.#user_DOB = dob;
    }
    validateDetails(){
      return false;
    }
    addUser(){

    }
    delUser(){

    }
    addGame() {

    }
    addBookmark() {

    }
    delBookmark() {

    }
    addTag() {

    }
    delTag() {

    }
    addRating() {

    }
    delRating() {

    }
  }
module.exports.user = user;
