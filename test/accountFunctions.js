const classes = require('../classes');
const expect  = require("chai").expect;
const mongoose = require('mongoose');
var schemas = require("../schemas");
var db = require('../db');
var server = require('../server');

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
      acc.addUser(function (err,res) {
        expect(err).to.be.null;
        user.findOne({username: acc.getUsername()}).exec(function (err,account) {
              expect(account).to.not.be.null;
              expect(account.username).to.equal(acc.getUsername());
              acc.setUserID(account._id);
              done();
        })
      });
    })
    it('Testing login with incorrect username',function (done) {
      acc.setUsername('fakeUsername');
      acc.validateDetails(function (result) {
        expect(result.status).to.equal("username");
        expect(result.status).to.not.equal("password");
        expect(result.status).to.not.equal('true');
        done();
      })

    })
    it('Testing login with correct username but incorrect password',function (done) {
      acc.setPassword('incorrectPassword')
      acc.validateDetails(function (result) {
        expect(result.status).to.not.equal("username");
        expect(result.status).to.equal("password");
        expect(result.status).to.not.equal('true');
        done();
      })
    })
    it('Testing login with correct username and correct password',function (done) {
      acc.validateDetails(function (result) {
        expect(result.status).to.not.equal("username");
        expect(result.status).to.not.equal("password");
        expect(result.status).to.equal('true');
        done();
      })
    })

    it('Testing account edit',function (done) {
          acc.setPassword('password123');
      acc.editUser({'password':'password123'},function (err,res) {
        expect(err).to.be.null;
        user.findOne({username: acc.getUsername()}).exec(function (err,account) {
              var secure = new classes.secure();
              var passwordHash = secure.saltHashPassword('password123',account.salt)
              expect(account).to.not.be.null;
              expect(account.password).to.equal(passwordHash.passwordHash);
              done();
        })
      });
    })
    it('Testing account deletion incorrect id',function (done) {
      acc.delUser('5e4bdab0e623ca4e5ca53945',function (err,res) {
        expect(err).to.not.be.null;
        expect(err).to.equal('request not valid');
        expect(res).to.be.false;
        user.countDocuments({'username':acc.getUsername()}, function (err, count) {
          expect(err).to.be.null;
          expect(count).to.equal(1);
          done();
        });
      });
    })
    it('Testing account deletion blank id',function (done) {
      acc.delUser(undefined,function (err,res) {
        expect(err).to.not.be.null;
        user.countDocuments({'username':acc.getUsername()}, function (err, count) {
          expect(err).to.be.null;
          expect(count).to.equal(1);
          done();
        });
      });
    })
    it('Testing account deletion',function (done) {
      acc.delUser(acc.getUserID(),function (err,res) {
        expect(err).to.be.null;
        expect(res.deletedCount).to.equal(1);
        user.countDocuments({'username':acc.getUsername()}, function (err, count) {
          expect(err).to.be.null;
          expect(count).to.equal(0);
          done();
        });
      });
    })
  })
})
