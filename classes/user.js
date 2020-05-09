var schemas = require("../schemas");
const classes = require('../classes');
module.exports = class user{
    #userID;
    #username;
    #password;
    #email;
    #user_DOB;
    #salt;
    constructor(userID,username,password,salt,email,dob){
      this.#userID = userID;
      this.#username = username;
      this.#password = password;
      this.#salt = salt;
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
          var secure = new classes.secure();
          var testPassword = secure.saltHashPassword(thisUSR.getPassword(),obj.salt);
          //if the username matches the password
          if (obj.password == testPassword.passwordHash) {
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
      //Encrypt password
      var secure = new classes.secure();
      var saltHash = secure.saltNewHashPassword(this.#password);
      //Create new user
      var user = new schemas.User({
        username: this.#username,
        password: saltHash.passwordHash,
        salt:saltHash.salt,
        email:this.#email,
        user_DOB:this.#user_DOB,
      })
      user.save(function (err,res) {
        callback(err,res)
      })
    }
    editUser(userJSON,callback){
      //edit and save current user
      var usr = this;
      var secure = new classes.secure();
      var user = schemas.User;
      user.findOne({'_id':this.#userID},function (err, result) {
        Object.keys(userJSON).forEach((item, i) => {
          if (item != "password") {
            result[item] = userJSON[item];
          }
        });
        if (usr.getPassword() != null) {
          var saltHash = secure.saltNewHashPassword(usr.getPassword());
          result.password = saltHash.passwordHash;
          result.salt = saltHash.salt;
        }
        result.save(function (err,res) {
          callback(err,res)
        });
      })
    }

    delUser(userID,callback){
      //delete current user
      if (this.getUserID()&& userID && this.getUserID() == userID) {
        var user = schemas.User;
        user.deleteOne({'_id':this.#userID},function (err,res) {
          callback(err,res)
        })
      }
      else{
        var err = 'request not valid',res = false;
        callback(err,res);
      }

    }
    viewUser(callback){
      var user = schemas.User;
      user.findOne({'_id':this.#userID}).select('-password -salt').exec(function (err, result) {
        callback(result);
      })
    }
    addGame(user,game_name,game_Summery,game_Rules,game_Player_Count,game_Equipment,game_IsNSFW,game_Categories,callback) {
      //add a new pending game
      var game = new classes.pending();
      game.game_Name=game_name;
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
    editGame(gameJSON,callback) {
      //edit a game
      var game = new schemas.Pending(gameJSON);
      game.userID = this.getUserID();
      game.id = game._id
      game.save(function(err,res) {
        callback(err,res)
      })
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
    getSalt(){
      return this.#salt;
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
    setSalt(salt){
      this.#salt = salt;
    }
    setEmail(email){
      this.#email = email;
    }
    setDOB(dob){
      this.#user_DOB = new Date(dob);
    }
    
  }
