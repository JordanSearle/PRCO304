var express = require('express');
var classes = require('./classes');
module.exports = function(app,res,data) {
  var check = {};
  //Session doesn't exist
  if (data==null) {
    check.user = 'anon';
    check.root = 'anon';
    res.status(200).sendFile("/", {
      root: check.root
    });
    app.use(express.static(check.user));
  }
  //session exist
  else{
    var user = new classes.admin();
    user.setUserID(data);
    //Checking if admin
    user.isAdmin(function (result) {
      if (result) {
        res.status(200).sendFile("/", {
          root: 'admin'
        });
        app.use(express.static('admin'));
      }
    })
    //User is not admin
    res.status(200).sendFile("/", {
      root: 'user'
    });
    app.use(express.static('user'));
  }
}
