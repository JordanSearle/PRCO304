const user = require('../classes/user');
const expect  = require("chai").expect;

describe('User Class',function() {
  context("Testing Validate User", function(){
    it('Password should return as false', function() {
      var acc = new user();
      var result = acc.validateDetails();
      expect(result).to.equal(false);
    })
  })
})
