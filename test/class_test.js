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
      expect(acc.getDOB()).to.equal("04 Dec 1995 00:12:00 GMT");
    })
    it('Should return DOB as false: details incorrect', function() {
      expect(acc.getDOB()).to.not.equal("false");
    })

  })
})
