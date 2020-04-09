var classes = require('./classes');
// Export the functions for each server operation, e.g Post game and get game
module.exports = {
//Unregistered User functions
  default: function (req,res) {
    // This it the app.get '/' function
  },
  login: function (req,res) {
    // This it the app.post /login
  },
  user: function (req,res) {
    // This is the app.post /createuser and Admin /user functions, both are being moved into the same function using abstract factory pattern.
  },
  nextGame: function (ws,req) {
    //This is the app.get /game/next
  },
  prevGame: function (ws,req) {
    //This is the app.get /game/prev
  },
  randomGame: function (ws,req) {
    //This is the app.get /game/random
  },
  //Logged on user and Admin Functions
  logout: function (req,res) {
    //This is the app.get /logout function
  },
  delUser: function (req,res) {
    //This is the app.delete /user and /users/userID functions, both are being moved into the same function using abstract factory pattern.
  },
  editUser: function (req,res) {
    //This is the app.put /user and /users/userID functions, both are being moved into the same function using abstract factory pattern.
  },
  getUser: function (req,res) {
    //This is the app.get /user and /users/userID functions, both are being moved into the same function using abstract factory pattern.
  },
  likeGame: function (ws,req) {
  //This is the ws.get /game/like function
  },
  newBookmark: function (req,res) {
    //This is the app.post /game/bookmark function
  },
  delBookmark: function (req,res) {
    //This is the app.delete /game/bookmark function
  },
  getBookmark: function (req,res) {
    //This is the app.get /game/bookmark/id function
    //May be redundant
  },
  getBookmarks: function (req,res) {
    //This is the app.get /game/bookmarks function
  },
  tagBookmark: function (req,res) {
    //This is the app.post /game/bookmark/tag function
  },
  untagBookmark: function (req,res) {
    //This is the app.delete /game/bookmark/tag function
  },
  newGame: function (req,res) {
    //This is the app.post /newgame and /pending functions, both are being moved into the same function using abstract factory pattern.

  },
  editGame: function (req,res) {
    //This is the app.put /editgame and /pending functions, both are being moved into the same function using abstract factory pattern.

  },
  delGame: function (req,res) {
    //This is the app.delete /delGame function
  },
  returnPending: function (req,res) {
    //This is the app.get /user/pending and /pending functions, both are being moved into the same function using abstract factory pattern.
  },
  delPending: function (req,res) {
    //This is the app.delete /pending/:id function
  },
  savePending:function (req,res) {
    //This is the app.post /pending/save function
  }
}
function controllerFactory() {
    this.createUser = function (model) {
        var user;

        switch(model) {
            case false:
            //logged on user level
                user = new classes.user();
                break;
            case true:
            //Admin user level
                user = new classes.admin();
                break;
            default:
              //Default user level
                break;
        }

        return user;
    }
}
