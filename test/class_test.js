const user = require('../classes/user');
const expect  = require("chai").expect;
var schemas = require("../schemas");

describe('User Class Getters and Setters',function() {
  var acc = new user.user("1","UserOne","password","email@email.com","04 Dec 1995 00:12:00 GMT");
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

})
