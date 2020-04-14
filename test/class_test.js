const classes = require('../classes');
const expect  = require("chai").expect;
const mongoose = require('mongoose');
var schemas = require("../schemas");
var db = require('../db');
var chaiHTTP = require('chai-http');
var chai = require('chai');
chai.use(require('chai-match'));
chai.use(chaiHTTP);
const server = 'http://localhost:9000'

describe('User Class Getters and Setters',function() {
  var acc = new classes.user("1","UserOne","password","email@email.com","04 Dec 1995 00:12:00 GMT");
  context("Testing Getters", function(){
    it('Should return userID as "1"', function() {
      expect(acc.getUserID()).to.equal("1");
    })
    it('Should return userID as false: details incorrect', function() {
      expect(acc.getUserID()).to.not.equal("false");
    })
    it('Should return username as "UserOne"', function() {
      expect(acc.getUsername()).to.equal("UserOne");
    })
    it('Should return username as false: details incorrect', function() {
      expect(acc.getUsername()).to.not.equal("false");
    })
    it('Should return password as "password"', function() {
      expect(acc.getPassword()).to.equal("password");
    })
    it('Should return password as false: details incorrect', function() {
      expect(acc.getPassword()).to.not.equal("false");
    })
    it('Should return Email as "email@email.com"', function() {
      expect(acc.getEmail()).to.equal("email@email.com");
    })
    it('Should return Email as false: details incorrect', function() {
      expect(acc.getEmail()).to.not.equal("false");
    })
    it('Should return DOB as "Mon, 04 Dec 1995 00:12:00 GMT"', function() {
      expect(acc.getDOB()).to.equal("Mon, 04 Dec 1995 00:12:00 GMT");
    })
    it('Should return DOB as false: details incorrect', function() {
      expect(acc.getDOB()).to.not.equal("false");
    })
  })
  context("Testing Setters", function(){
    it('Should set userID as "5"', function() {
      acc.setUserID("5");
      expect(acc.getUserID()).to.equal("5");
    })
    it('User ID should no longer = 1', function() {
      expect(acc.getUserID()).to.not.equal("1");
    })
    it('Should set username as "UserFive"', function() {
      acc.setUsername("UserFive");
      expect(acc.getUsername()).to.equal("UserFive");
    })
    it('Username should no longer be UserOne', function() {
      expect(acc.getUsername()).to.not.equal("UserOne");
    })
    it('Should set password as "MoreSecurePassword"', function() {
      acc.setPassword("MoreSecurePassword");
      expect(acc.getPassword()).to.equal("MoreSecurePassword");
    })
    it('password should no longer be password', function() {
      expect(acc.getPassword()).to.not.equal("password");
    })
    it('Should set Email as "email@gmail.com"', function() {
      acc.setEmail("email@gmail.com")
      expect(acc.getEmail()).to.equal("email@gmail.com");
    })
    it('Email Should no longer be email@email.com', function() {
      expect(acc.getEmail()).to.not.equal("email@email.com");
    })
    it('Should set DOB as "Wed, 04 Dec 1996 00:12:00 GMT"', function() {
      acc.setDOB("Wed, 04 Dec 1996 00:12:00 GMT");
      expect(acc.getDOB()).to.equal("Wed, 04 Dec 1996 00:12:00 GMT");
    })
    it('DOB should no longer be "Mon, 04 Dec 1996 00:12:00 GMT"', function() {
      expect(acc.getDOB()).to.not.equal("Mon, 04 Dec 1995 00:12:00 GMT");
    })
  })
})
describe('Admin class getters and setters',function() {
  var admin = new classes.admin("A1","AdminTemp","password","AdminTemp@email.com","04 Dec 1995 00:12:00 GMT");
  context('Testing getters',function () {
    it('getUserID returns UserID as "A1"',function () {
      expect(admin.getUserID()).to.equal("A1");
    })
    it('getUsername returns username as "AdminTemp"',function () {
      expect(admin.getUsername()).to.equal("AdminTemp");
    })
    it('getPassword returns password as "password"',function () {
      expect(admin.getPassword()).to.equal("password");
    })
    it('getEmail returns Email as "AdminTemp@email.com"',function () {
      expect(admin.getEmail()).to.equal("AdminTemp@email.com");
    })
    it('getDOB returns DOB as "Mon, 04 Dec 1995 00:12:00 GMT"',function () {
      expect(admin.getDOB()).to.equal("Mon, 04 Dec 1995 00:12:00 GMT");
    })
  })

  context("Testing Setters", function(){
    it('Should set userID as "5"', function() {
      admin.setUserID("A5");
      expect(admin.getUserID()).to.equal("A5");
    })
    it('UserID should no longer = 1', function() {
      expect(admin.getUserID()).to.not.equal("A1");
    })
    it('Should set username as "AdminFive"', function() {
      admin.setUsername("AdminFive");
      expect(admin.getUsername()).to.equal("AdminFive");
    })
    it('Username should no longer be AdminOne', function() {
      expect(admin.getUsername()).to.not.equal("AdminOne");
    })
    it('Should set password as "MoreSecurePassword"', function() {
      admin.setPassword("MoreSecurePassword");
      expect(admin.getPassword()).to.equal("MoreSecurePassword");
    })
    it('password should no longer be password', function() {
      expect(admin.getPassword()).to.not.equal("password");
    })
    it('Should set Email as "admin@gmail.com"', function() {
      admin.setEmail("admin@gmail.com")
      expect(admin.getEmail()).to.equal("admin@gmail.com");
    })
    it('Email Should no longer be email@email.com', function() {
      expect(admin.getEmail()).to.not.equal("email@email.com");
    })
    it('Should set DOB as "Wed, 04 Dec 1996 00:12:00 GMT"', function() {
      admin.setDOB("Wed, 04 Dec 1996 00:12:00 GMT");
      expect(admin.getDOB()).to.equal("Wed, 04 Dec 1996 00:12:00 GMT");
    })
    it('DOB should no longer be "Mon, 04 Dec 1996 00:12:00 GMT"', function() {
      expect(admin.getDOB()).to.not.equal("Mon, 04 Dec 1995 00:12:00 GMT");
    })
  })
})
describe('testing Admin and User overrides',function () {
  context('testing add and delete game for admin and user',function () {
    after(function (done) {
      var gm = schemas.Game;
      gm.deleteMany({game_Name:'Override Game Name'},function (err,res) {
      })
      var pn = schemas.Pending;
      pn.deleteMany({game_Name:'Override Game Name'},function (err,res) {
        done();
      })
    })
    beforeEach(function (done) {
      var gm = schemas.Game;
      gm.deleteMany({game_Name:'Override Game Name'},function (err,res) {
      })
      var pn = schemas.Pending;
      pn.deleteMany({game_Name:'Override Game Name'},function (err,res) {
        done();
      })
    })
    it('testing add game by user',function (done) {
      var user = new classes.user()
      user.setUserID('5e4bdab0e623ca4e5ca53945');
      user.addGame('Override Game Name','Override Game Name','Override Game Name','1+',['none'],false,function(err,res) {
        var db = schemas.Pending;
        db.countDocuments({game_Name:'Override Game Name'}).exec(function (err,res) {
          expect(err).to.be.null;
          expect(res).to.equal(1);
          done();
        })
      })
    })
    it('testing add game by admin',function (done) {
      var admin = new classes.admin()
      admin.setUserID('5e4bdab0e623ca4e5ca53945');
      admin.addGame('Override Game Name','Override Game Name','Override Game Name','1+',['none'],false,function(err,res) {
        var db = schemas.Game;
        db.countDocuments({game_Name:'Override Game Name'}).exec(function (err,res) {
          expect(err).to.be.null;
          expect(res).to.equal(1);
          done();
        })
      })
    })
  })
})
