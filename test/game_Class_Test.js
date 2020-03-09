const classes = require('../classes');
const expect  = require("chai").expect;
const mongoose = require('mongoose');
var schemas = require("../schemas");
var db = require('../db');


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
    //games.deleteMany({'game_Name':'test game name'}).exec();
  })
  before(function () {
    games.deleteMany({'game_Name':'test game name'}).exec();
  })
  context('testing variable values',function () {
    it('Expecting name to equal: test game name',function () {
      expect(game.game_Name).to.equal('test game name');
      game.game_Name = 'New Test Game Name';
      expect(game.game_Name).to.equal('New Test Game Name');
    })
  })
  context('Testing Game Methods',function () {
    it('Saving new game to DB',function (done) {
      this.timeout(3000);
      game.saveGame(new mongoose.Types.ObjectId,function (err) {
        expect(err).to.be.null;
      })
      setTimeout(function(){
        games.countDocuments({'game_Name':'test game name'}, function (err, count) {
          expect(err).to.be.null;
          expect(count).to.equal(1);
          done();
        });
      }, 50);
    })
    it('Updating game in DB',function(done) {
      this.timeout(3000);
      game.game_Rules = 'new game rules';
      game.updateGame(function (err) {
        expect(err).to.be.null;
      });
      setTimeout(function(){
        games.findOne({'_id':game.game_UID},function (err, result) {
          expect(err).to.be.null;
          expect(result.game_Rules).to.not.equal('test game rules');
          expect(result.game_Rules).to.equal('new game rules');
        })
        done();
      }, 50);
    })

    it('Testing unique DB values',function (done) {
      this.timeout(3000);
      game.saveGame(new mongoose.Types.ObjectId,function (err) {
        expect(err).to.not.be.null;
        done();
      })
    })

    it('Deleting game in DB',function (done) {
      this.timeout(500);
      game.delGame(function (err) {
        expect(err).to.be.null;
      });
      setTimeout(function(){
        games.countDocuments({'game_Name':'test game name'}, function (err, count) {
          expect(count).to.equal(0);
          expect(err).to.be.null;
          done();
        });
      }, 10);
    })
  })
})
