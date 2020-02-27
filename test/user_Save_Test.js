const classes = require('../classes');
const expect  = require("chai").expect;
const mongoose = require('mongoose');
var schemas = require("../schemas");
var db = require('../db');

describe('User Class account functions',function() {
  var acc = new classes.user("1","UserTwo","password","emailTwo@email.com","04 Dec 1995 00:12:00 GMT");
  var user = schemas.User;
  this.timeout(400);
  beforeEach(function() {
    acc.setUsername('UserTwo');
    acc.setPassword('password');
    acc.setEmail('emailTwo@email.com');
    acc.setDOB('04 Dec 1995 00:12:00 GMT');
  });
  after(function () {
    user.deleteMany({'username':acc.getUsername()},function (err) {
  });
  })
  before(function () {
    user.deleteMany({'username':acc.getUsername()},function (err) {
    expect(err).to.be.null;
  });
  })
  context('User class login and creation test',function () {
    it('Testing account creation',function (done) {
      acc.addUser(function (err) {
        expect(err).to.be.null;
      });
      //Read from DB to test if it worked
      setTimeout(function () {
        user.findOne({username: acc.getUsername()}).exec(function (err,account) {
              expect(account).to.not.be.null;
              expect(account.username).to.equal(acc.getUsername());
              acc.setUserID(account._id);
              done();
        })
      }, 10);
    })
    it('Testing login with incorrect username',function (done) {
      acc.setUsername('fakeUsername');
      setTimeout(function () {
        acc.validateDetails(function (result) {
          expect(result).to.equal("username");
          expect(result).to.not.equal("password");
          expect(result).to.not.equal('true');
          done();
        })
      }, 10);

    })
    it('Testing login with correct username but incorrect password',function (done) {
      acc.setPassword('incorrectPassword')
      setTimeout(function () {
        acc.validateDetails(function (result) {
          expect(result).to.not.equal("username");
          expect(result).to.equal("password");
          expect(result).to.not.equal('true');
          done();
        })
      }, 10);
    })

    it('Testing login with correct username and correct password',function (done) {
      setTimeout(function () {
        acc.validateDetails(function (result) {
          expect(result).to.not.equal("username");
          expect(result).to.not.equal("password");
          expect(result).to.equal('true');
          done();
        })
      }, 10);
    })

    it('Testing account edit',function (done) {
      acc.setPassword('password123');
      acc.editUser(function (err) {
        expect(err).to.be.null;
      });
      setTimeout(function () {
        user.findOne({username: acc.getUsername()}).exec(function (err,account) {
              expect(account).to.not.be.null;
              expect(account.password).to.equal(acc.getPassword());
              done();
        })
      }, 10);
    })
    it('Testing account deletion',function (done) {
      acc.delUser(function (err) {
        expect(err).to.be.null;
      });
      setTimeout(function(){
        user.countDocuments({'_id':acc.getUserID()}, function (err, count) {
          expect(err).to.be.null;
          expect(count).to.equal(0);
          done();
        });
      }, 10);
    })
  })
})
