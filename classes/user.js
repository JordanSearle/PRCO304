var schemas = require("../schemas");
class user{
    #userID;
    #username;
    #password;
    #email;
    #user_DOB;
    constructor(userID,username,password,email,dob){
      this.#userID = userID;
      this.#username = username;
      this.#password = password;
      this.#email = email;
      this.#user_DOB = Date.parse(dob);
    }
    validateDetails(){
      //Return true or false based on password and username values
      var user = schemas.User;
      user.findOne({
        username: this.#username
      }, function(err, obj) {
        if (err) {
          console.log(err);
          res.status(404).send(err);
        };
        //If user doesn't exist
        if (obj === null) {
          return "username";
        }
        //If it find the item in the DB
        else {
          //if the username matches the password
          if (obj.password == req.body.Password) {
            //res.status(200).send(String(obj.userID));
            //Login Stuff and session processes here.
            return true;
          }
          //If the password is incorrect
          else {
            return "password";
          }
        }
      });

    }
    addUser(){
      //Create new user

    }
    delUser(){
      //delete user
    }
    addGame() {
      //add a new pending game
    }
    addBookmark() {
      //add a new bookmark
    }
    delBookmark() {
      //delete bookmark
    }
    addTag() {
      //add bookmark tag
    }
    delTag() {
      //remove bookmark tag
    }
    addRating() {
      //add a game rating
    }
    delRating() {
      //remove rating
    }
    read(){
      //returns user details from database
    }
    //getters and setters
    getUserID(){
      return this.#userID;
    }
    getUsername(){
      return this.#username;
    }
    getPassword(){
      return this.#password;
    }
    getEmail(){
      return this.#email;
    }
    getDOB(){
      var date = new Date(this.#user_DOB)
      return date.toUTCString();
    }
    setUserID(userID){
      this.#userID = userID;
    }
    setUsername(username){
      this.#username = username;
    }
    setPassword(password){
      this.#password = password;
    }
    setEmail(email){
      this.#email = email;
    }
    setDOB(dob){
      this.#user_DOB = new Date(dob);
    }
  }
module.exports.user = user;
