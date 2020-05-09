const classes = require('../classes');
const expect  = require("chai").expect;
const mongoose = require('mongoose');
var schemas = require("../schemas");
var db = require('../db');
var server = require('../server')
describe('Game rating tests',function () {
  gm = new classes.game();
  game = schemas.Game;
  //Before / After functions
  before(function (done) {
    before(done =>{
      server.on( "app_started", function()
      {

      })
    })
    var gm = new schemas.Game({
      _id:mongoose.Types.ObjectId('5e7ceb51e920465eec76cdc2'),
      game_Name:'rating test',
      game_Summery:'rating test',
      game_Rules:'rating test',
      game_Player_Count:'1-2',
      game_Equipment:['test1','test3'],
      game_IsNSFW:false,
      rating:[],
      ratingCount:0,
      userID:mongoose.Types.ObjectId('5e4bdab0e623ca4e5ca53945')
    })
    gm.save(function (err,res) {
      done();
    })
  })

  after(function (done) {
      var gm = schemas.Game
      gm.deleteMany({'game_Name':'rating test'}).exec(function (err,result) {
        done()
      })
  })
  afterEach(function () {
      var gm = schemas.Game
      gm.deleteMany({'game_Name':'rating test'}).exec(function (err,result) {
        if(err)console.log(err);
      })
  })

  it('testing rating function',function (done) {
    gm.rate('5e7ceb51e920465eec76cdc2','5e4bdab0e611ca4e5ca53945',function (err,res) {
      //not going to be called unless there is an err
      expect(err).to.be.null;
      game.findOne({'game_Name':'rating test'}).exec(function (err,result) {
        expect(err).to.be.null;
        expect(result.ratingCount).to.equal(1);
        expect(result.rating[0].userID).to.equal('5e4bdab0e611ca4e5ca53945');
        done();
      })
    })
  })
})
describe('Game Delete Rating test',function () {
  gm = new classes.game();
  game = schemas.Game;
  //Before / After functions
  before(function (done) {
    before(done =>{
      server.on( "app_started", function()
      {

      })
    })
    var gm = new schemas.Game({
      _id:mongoose.Types.ObjectId('5e7ceb51e920465eec76cdc2'),
      game_Name:'rating test',
      game_Summery:'rating test',
      game_Rules:'rating test',
      game_Player_Count:'1-2',
      game_Equipment:['test1','test3'],
      game_IsNSFW:false,
      rating:[{gameID:'5e7ceb51e920465eec76cdc2',userID:'5e4bdab0e611ca4e5ca53945'}],
      ratingCount:1,
      userID:mongoose.Types.ObjectId('5e4bdab0e623ca4e5ca53945')
    })
    gm.save(function (err,res) {
      done();
    })
  })

  after(function (done) {
      var gm = schemas.Game
      gm.deleteMany({'game_Name':'rating test'}).exec(function (err,result) {
        done()
      })
  })

  it('Testing rating remove',function (done) {
    gm.rate('5e7ceb51e920465eec76cdc2','5e4bdab0e611ca4e5ca53945',function (err,res) {
      //not going to be called unless there is an err
      expect(err).to.be.null;
      game.findOne({'game_Name':'rating test'}).exec(function (err,result) {
        expect(err).to.be.null;
        expect(result.ratingCount).to.equal(0);
        done();
      })
    })
  })
})
