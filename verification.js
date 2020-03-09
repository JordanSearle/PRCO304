var express = require('express');
var classes = require('./classes');
module.exports = function(app,res,data) {
  //Session doesn't exist
  if (data==null) {
    res.status(200).sendFile("/", {
      root: 'anon'
    });
    app.use(express.static('anon'));
  }
}
module.exports.admin = function isAdmin(app,res,data) {
  var user = new classes.admin();
  user.setUserID(data);
  //Checking if admin
  user.isAdmin(function (result) {
    if (result) {
    app.use(express.static('admin'));
      res.status(200).sendFile("/", {
        root: 'admin'
      });
    }
  })
}
module.exports.rootCheck = function rootCheck(app,res,data) {
  if (data==null) {
    res.status(200).sendFile("/", {
      root: 'anon'
    });
    app.use(express.static('anon'));
  }
  else{
    var user = new classes.admin();
    user.setUserID(data);
    //Checking if admin
    user.isAdmin(function (result) {
      if (result) {
      app.use(express.static('admin'));
        res.status(200).sendFile("/", {
          root: 'admin'
        });
      }
      else{
        app.use(express.static('user'));
          res.status(200).sendFile("/", {
            root: 'user'
          });
      }
    })
  }
}
