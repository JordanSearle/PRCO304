var express = require('express');
var classes = require('./classes');
module.exports = function (req,res,data,callback) {
  if (!isLogged(data)) {
    req.app.use(express.static('Client/user/anon'));
    res.status(200).sendFile("/", {
      root: 'Client/user/anon'
    });
      callback(false)
  }
  else {
    callback(true);
  }
}
module.exports.isLogged = function (req,res,data,callback) {
  if (!isAdmin(data)) {
    req.app.use(express.static('Client/user/anon'));
      res.redirect('/');
      callback(false);
  }
  else {
    callback(true);
  }
}
module.exports.setRoot = function (req,res,data) {
  //Data = UserID
  var user = new classes.admin();
  user.setUserID(data);
  //Check if Admin
  user.isAdmin(function (result) {
    if (result) {
      req.app.use(express.static('Client'));
      res.status(200).sendFile("/", {
        root: 'Client'
      });
    }
    else{
      req.app.use(express.static('Client/user'));
      res.status(200).sendFile("/", {
        root: 'Client/user'
      });
    }
  })
  //else set user
}
module.exports.rootCheck = function (req,res,data) {
    if (data==null) {
    res.redirect('/');
    req.app.use(express.static('Client/user/anon'));
  }
  else{
    var user = new classes.admin();
    user.setUserID(data);
    //Checking if admin
    user.isAdmin(function (result) {
      if (result) {
      req.app.use(express.static('Client'));
        res.redirect('/');
      }
      else{
        req.app.use(express.static('Client/user'));
          res.redirect('/');
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
