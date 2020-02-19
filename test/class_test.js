const classes = require('../classes');
const expect  = require("chai").expect;
var schemas = require("../schemas");
var db = require('../db');

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
  var admin = new classes.admin("A1","AdminOne","password","Admin@email.com","04 Dec 1995 00:12:00 GMT");
  context('Testing getters',function () {
    it('getUserID returns UserID as "A1"',function () {
      expect(admin.getUserID()).to.equal("A1");
    })
    it('getUsername returns username as "AdminOne"',function () {
      expect(admin.getUsername()).to.equal("AdminOne");
    })
    it('getPassword returns password as "password"',function () {
      expect(admin.getPassword()).to.equal("password");
    })
    it('getEmail returns Email as "Admin@email.com"',function () {
      expect(admin.getEmail()).to.equal("Admin@email.com");
    })
    it('getDOB returns DOB as "Mon, 04 Dec 1995 00:12:00 GMT"',function () {
      expect(admin.getDOB()).to.equal("Mon, 04 Dec 1995 00:12:00 GMT");
    })
    it('getIsAdmin returns isAdmin as true',function () {
      expect(admin.getIsAdmin()).to.equal(true);
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
describe('Game test',function () {
  var games = schemas.Game;
  var game = new classes.game('data','test game name','test game summery','test game rules','test game count', 'test equipment',false);
  beforeEach(function() {
    game.game_Name = 'test game name';
    game.game_Summery = 'test game summery';
    game.game_Rules = 'test game rules';
    game.game_Player_Count = '1-2';
    game.game_Equipment = ['test1','test3'];
    game.game_IsNSFW = false;
  });
  after(function() {
    games.deleteOne({'_id':game.game_UID}, function (err) {
    if (err) console.log(err);
  });
  });
  context('testing variable values',function () {
    it('Expecting name to equal: test game name',function () {
      expect(game.game_Name).to.equal('test game name');
      game.game_Name = 'New Test Game Name';
      expect(game.game_Name).to.equal('New Test Game Name');
    })
  })
  context('Testing Game Methods',function () {
    it('Saving new game to DB',function () {
      game.saveGame(function (err) {
        if(err) console.log(err);
      })
      games.countDocuments({'game_Name':'test game name'}, function (err, count) {
        expect(err).to.be.null;
        expect(count).to.equal(0);
      });

    })
    it('Updating game in DB',function() {
      console.log(game.game_UID);
      game.game_Rules = 'new game rules';
      game.updateGame();
      games.findOne({'_id':game.game_UID},function (err, result) {
        //expect(err).to.be.null;
      //  expect(result.game_Rules).to.equal('new game rules');
      })
    })
    it('Deleting game in DB',function () {
      game.delGame();
      games.countDocuments({'game_Name':'test game name'}, function (err, count) {
      });
    })
  })
})
