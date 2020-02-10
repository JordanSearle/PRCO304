const user = require('../classes/user');
const expect  = require("chai").expect;
var schemas = require("../schemas");

describe('User Class Getters and Setters',function() {
  var acc = new user.user("sda","sda","sda","sda","sda");
  context("Testing Getters", function(){
    it('Should return username as "UserOne"', function() {
      expect(acc.getUsername()).to.equal("UserOne");
    })
    it('Should return username as false: details incorrect', function() {
      expect(acc.getUsername()).to.not.equal("false");
    })
    it('Should return password as "password"', function() {
      expect(acc.getPassword()).to.equal("UserOne");
    })
    it('Should return password as false: details incorrect', function() {
      expect(acc.getPassword()).to.not.equal("false");
    })
    it('Should return Email as "email@email.com"', function() {
      expect(acc.getUsername()).to.equal("UserOne");
    })
    it('Should return Email as false: details incorrect', function() {
      expect(acc.getUsername()).to.not.equal("false");
    })
    it('Should return password as "password"', function() {
      expect(acc.getPassword()).to.equal("UserOne");
    })
    it('Should return as false: details incorrect', function() {
      expect(acc.getPassword()).to.not.equal("false");
    })

  })
})
