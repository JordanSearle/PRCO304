const classes = require('../classes');
const expect  = require("chai").expect;
const mongoose = require('mongoose');
var schemas = require("../schemas");
var db = require('../db');

describe('Game rating tests',function () {
  gm = new classes.game();
  game = schemas.Game;
  before(function () {
    var gm = new schemas.Game({
      _id:mongoose.Types.ObjectId('5e7ceb51e920465eec76cdc2'),
      game_Name:'rating test',
      game_Summery:'rating test',
      game_Rules:'rating test',
      game_Player_Count:'1-2',
      game_Equipment:['test1','test3'],
      game_IsNSFW:false,
      userID:mongoose.Types.ObjectId('5e4bdab0e623ca4e5ca53945')
    })
    gm.save(function (err) {
      if(err)console.log(err);
    })
  })
  after(function () {
      var gm = schemas.Game
      gm.deleteMany({'game_Name':'rating test'}).exec(function (err,result) {
        if(err)console.log(result);
      })
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
      })
      done();
    }, 5);
  })
  it('testing game rating calculation',function (done) {
    gm.calculateRating()
    setTimeout(function () {
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
