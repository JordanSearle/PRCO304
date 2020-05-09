var expect = require('chai').expect;
var classes = require('../classes');
var factory = require('../serverFunctions').factory;
const mongoose = require('mongoose');
var schemas = require("../schemas");
adminid = '5e4bdab0e623ca4e5ca53946'
userid =  '5e4bdab0e623ca4e5ca53945'
var app = require('../server.js');

describe('testing factory methods',function () {
  var secure = new classes.secure()
  var saltHash = secure.saltNewHashPassword('password');
  this.timeout(100);
  before(function (done) {
    var users = schemas.User;
    users.deleteOne({_id:userid}).exec(function (err) {
      if(err)console.log(err);
    })
    users.deleteOne({_id:adminid}).exec(function (err) {
      if(err)console.log(err);
    })
    //Create users with set IDs
    var user = new schemas.User({
      _id:mongoose.Types.ObjectId(userid),
      username: 'factory test name',
      password: saltHash.passwordHash,
      salt:saltHash.salt,
      email:'e@e.com',
      user_DOB:new Date()
    })
    user.save(function (err,res) {
      if(err)console.log(err);
    })
    var admin = new schemas.User({
      _id:mongoose.Types.ObjectId(adminid),
      username: 'factory admin test name',
      password: saltHash.passwordHash,
      salt:saltHash.salt,
      email:'a@e.com',
      user_DOB:new Date(),
      isAdmin: true
    })
    admin.save(function (err,res) {
      if(err)console.log(err);
      done()
    })
  })
  after(function (done) {
    //Delete new users
    var user = schemas.User;
    user.deleteOne({_id:userid}).exec(function (err) {
      if(err)console.log(err);
    })
    user.deleteOne({_id:adminid}).exec(function (err) {
      if(err)console.log(err);
      done()
    })
  })
  it('testing with logged out user',function (done) {
    var fac = new factory();
    //if req.session.user == undefined
      fac.create(undefined,function (result) {
        expect(result).to.equal(false);
        done();
      })
  })
  it('testing with logged in user',function (done) {
    var fac = new factory();
    fac.create('5e4bdab0e623ca4e5ca53945',function (result) {
      expect(result).to.be.an.instanceof(classes.user);
      done();
    });
  })
  it('testing with logged in admin',function (done) {
    var fac = new factory();
    fac.create(adminid,function (result) {
      expect(result).to.be.an.instanceof(classes.admin);
      done();
    });
  })
  it('testing with no user rtnClass value',function (done) {
    var fac = new factory();
    fac.create(undefined,function (result) {
      expect(result).to.equal(false);
      done();
    });
  })
  it('testing with no matching rtnClass value in database',function (done) {
    var fac = new factory();
    fac.create('n074r34l1d',function (result) {
      expect(result).to.equal(false);
      done();
    });
  })
})
