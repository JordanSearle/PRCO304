const user = require('../classes/user');
const expect  = require("chai").expect;
var schemas = require("../schemas");

describe('User Class',function() {
  var acc = new user.user("sda","sda","sda","sda","sda");
  context("Testing Validate User", function(){
    it('Should return as true: details correct', function() {
      var result = acc.validateDetails();
      expect(result).to.equal(true);
    })
    it('Should return as false: details incorrect', function() {
      acc.setPassword(null);
      var result = acc.validateDetails();
      expect(result).to.equal(false);
    })

  })
})
