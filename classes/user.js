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
    function validateDetails(){

    }
    function addUser(){

    }
    function delUser(){

    }
    function addGame() {

    }
    function addBookmark() {

    }
    function delBookmark() {

    }
    function addTag() {

    }
    function delTag() {

    }
    function addRating() {

    }
    function delRating() {

    }
  }
module.exports.user = user;
