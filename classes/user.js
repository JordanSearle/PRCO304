var schemas = require("../schemas");
module.exports = class user{
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
    validateDetails(callback){
      //Return true or false based on password and username values
      var user = schemas.User;
      var thisUSR = this;
      user.findOne({
        username: thisUSR.getUsername()
      }, function(err, obj) {
        if (err) {
          console.log(err);
        };
        //If account doesn't exist
        if (obj === null) {
          callback({'status':"username",
                    'uID':null
        });
        }
        //If it find the item in the DB
        else {
          //if the username matches the password
          if (obj.password == thisUSR.getPassword()) {
            //res.status(200).send(String(obj.userID));
            //Login Stuff and session processes here.
            callback({'status':'true',
                      'uID':obj._id
          });
          }
          //If the password is incorrect
          else {
            callback({'status':"password",
                      'uID':null
                      });
          }
        }
      });

    }
    addUser(callback){
      //Create new user
      var user = new schemas.User({
        username: this.#username,
        password: this.#password,
        email:this.#email,
        user_DOB:this.#user_DOB,
      })
      user.save(function (err,res) {
        callback(err,res)
      })
    }
    editUser(callback){
      //edit and save current user
      var usr = this;
      var username = this.#username;
      var user = schemas.User;
      user.findOne({'_id':this.#userID},function (err, result) {
        result.username=username;
        result.password=usr.getPassword();
        result.email=usr.getEmail();
        result.user_DOB=usr.getDOB();
        result.save(function (err) {
          if(err)callback(err);
        });
      })
    }

    delUser(callback){
      //delete current user
      var user = schemas.User;
      user.deleteOne({'_id':this.#userID},function (err,res) {
        callback(err,res)
      })
    }
    viewUser(callback){
      var user = schemas.User;
      user.findOne({'_id':this.#userID}).select('-password').exec(function (err, result) {
        callback(result);
      })
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
