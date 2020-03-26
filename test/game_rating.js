const classes = require('../classes');
const expect  = require("chai").expect;
const mongoose = require('mongoose');
var schemas = require("../schemas");
var db = require('../db');

describe('Game rating tests',function () {
  gm = new classes.game();
  game = schemas.Game;
  before(function () {

  })
  beforeEach(function () {
    gm.game_Name = 'rating test';
    gm.game_Summery = 'rating test';
    gm.game_Rules = 'rating test';
    gm.game_Player_Count = '1-2';
    gm.game_Equipment = ['test1','test3'];
    gm.game_IsNSFW = false;
    gm.game_UID = '5e7ceb51e920465eec76cdc2';
  })
  it('testing adding a rating to the game',function (done) {
    gm.addRating(mongoose.Types.ObjectId('5e4bdab0e611ca4e5ca53945'),5,function (err) {
      expect(err).to.be.null;
    })
    setTimeout(function () {
      game.findOne({'game_Name':'rating test'}).exec(function (err,res) {
        expect(err).to.be.null;
        expect(res.rating[0].value).to.equal(5);
      })
      done();
    }, 5);
  })
  it('testing game rating calculation',function (done) {
    gm.calculateRating()
    setTimeout(function () {
      expect(gm.game_Rating).to.equal(5);
      done();
    }, 10);
  })
  it('testing deleting a rating to the game',function (done) {
    gm.delRating(mongoose.Types.ObjectId('5e4bdab0e611ca4e5ca53945'),5,function (res) {
      expect(err).to.be.null;
    })
    setTimeout(function () {
      game.findOne({'game_Name':'rating test'}).exec(function (err,res) {
        expect(err).to.be.null;
        expect(res.rating.length).to.equal(0);
      })
      done();
    }, 10);
  })
})
