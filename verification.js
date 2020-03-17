var express = require('express');
var classes = require('./classes');
module.exports = function (app,res,data) {
  if (!isLogged(data)) {
    app.use(express.static('anon'));
      res.status(200).sendFile("/", {
        root: 'anon'
      });
  }
}
module.exports.isLogged = function (app,res,data) {
  if (!isAdmin(data)) {
    app.use(express.static('Client/user/anon'));
      res.status(200).sendFile("/", {
        root: '/Client/user/anon'
      });
  }
}
module.exports.setRoot = function (app,res,data) {
  //Data = UserID
  var user = new classes.admin();
  user.setUserID(data);
  //Check if Admin
  user.isAdmin(function (result) {
    if (result) {
      app.use(express.static('Client'));
        res.status(200).sendFile("/", {
          root: 'Client'
        });
    }
    else{
      app.use(express.static('Client/user'));
        res.status(200).sendFile("/", {
          root: 'Client/user'
        });
    }
  })
  //else set user
}
module.exports.rootCheck = function (app,res,data) {
    if (data==null) {
    res.status(200).sendFile("/", {
      root: 'Client/user/anon'
    });
    app.use(express.static('Client/user/anon'));
  }
  else{
    var user = new classes.admin();
    user.setUserID(data);
    //Checking if admin
    user.isAdmin(function (result) {
      if (result) {
      app.use(express.static('Client'));
        res.status(200).sendFile("/", {
          root: 'Client'
        });
      }
      else{
        app.use(express.static('Client/user'));
          res.status(200).sendFile("/", {
            root: 'Client/user'
          });
      }
    })
}
}
function isLogged(data) {
  //Session doesn't exist
  if (data==null) {
    return false;
  }
  else {
    return true;
  }
}
function isAdmin(data) {
  var user = new classes.admin();
  user.setUserID(data);
  //Checking if admin
  user.isAdmin(function (result) {
    console.log(result);
    if (result) {
      return(true);
    }
    else{
      return(false);
    }
  })
}
