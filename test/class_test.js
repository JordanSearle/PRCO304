const user = require('../classes/user');
const expect  = require("chai").expect;
var schemas = require("../schemas");

describe('User Class Getters and Setters',function() {
  var acc = new user.user("sda","sda","sda","sda","sda");
  context("Testing Getters", function(){
    it('Should return username as "UserOne"', function() {
      expect(acc.getUsername()).to.equal("UserOne");
    })
    it('Should return as false: details incorrect', function() {
      expect(result).to.not.equal("false");
    })

  })
})
