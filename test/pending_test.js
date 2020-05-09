const classes = require('../classes');
const expect  = require("chai").expect;
const mongoose = require('mongoose');
var schemas = require("../schemas");
var db = require('../db');
var server = require('../server')

describe('Testing, user pending functions',function () {
  var game = new classes.game();
  game.game_UID= new mongoose.Types.ObjectId;
  game.userID= new mongoose.Types.ObjectId;
  game.game_Name= 'Pending game name';
  game.game_Summery='Pending game name';
  game.game_Rules= 'Pending game name';
  game.game_Player_Count= 'Pending game name';
  game.game_Equipment= ['Pending game name'];
  game.game_IsNSFW=false;

  before(function (done) {
    const games = new schemas.Game({
      //UserID needs to be set from the logged on user.
      _id: mongoose.Types.ObjectId('5e4bdab0e623ca4e5ca53999'),
      userID: new mongoose.Types.ObjectId,
      game_Name: 'Pending game name',
      game_Summery:'Pending game name',
      game_Rules: 'Pending game name',
      game_Player_Count: 'Pending game name',
      game_Equipment: ['Pending game name'],
      game_IsNSFW:false
   })
   games.save(function (err,res) {
     done()
   });
  })
  after(function (done) {
    const games = schemas.Game;
    games.deleteMany({game_Name:'Pending game name'},function (err,res) {
      done();
    })
  })
  afterEach(function (done) {
    var uGame = schemas.Pending;
    uGame.deleteOne({game_Name:'Pending game name'}, function (err,result) {
      if (err) callback(err);
      done();
    });
  })

  it('User saving the game',function (done) {
    game.addPending(new mongoose.Types.ObjectId,function (err,res) {
      expect(err).to.be.null;
      var pn = schemas.Pending;
      pn.findOne({game_Name: 'Pending game name'}).exec(function (err,res) {
        expect(err).to.be.null;
        expect(res).to.not.be.null;
        expect(res).to.have.property('game_Name','Pending game name');
        expect(res).to.have.property('game_Summery','Pending game name');
        expect(res).to.have.property('game_Rules','Pending game name');
        expect(res).to.have.property('game_Player_Count','Pending game name');
        expect(res).to.have.property('game_IsNSFW',false);
        done();
      })
    })
  })
  it('User suggesting a game edit',function (done) {
    game.editPending('5e4bdab0e623ca4e5ca53999',function (err,res) {
      expect(err).to.be.null;
      var pend = schemas.Pending;
      pend.findOne({game_Name: 'Pending game name'}).exec(function (err,res) {
        expect(err).to.be.null;
        expect(res).to.not.be.null;
        expect(res).to.have.property('game_Name','Pending game name');
        expect(res).to.have.property('game_Summery','Pending game name');
        expect(res).to.have.property('game_Rules','Pending game name');
        expect(res).to.have.property('game_Player_Count','Pending game name');
        expect(res).to.have.property('game_IsNSFW',false);
        done();
      })
    })
  })
})
describe('Testing, admin approving or denying a pending request functions',function () {
  var game = new classes.game();
  game.game_UID= new mongoose.Types.ObjectId;
  game.userID= new mongoose.Types.ObjectId;
  game.game_Name= 'Pending game name';
  game.game_Summery='Pending game name';
  game.game_Rules= 'Pending game name';
  game.game_Player_Count= 'Pending game name';
  game.game_Equipment= ['Pending game name'];
  game.game_IsNSFW=false;

  afterEach(function (done) {
    var game = schemas.Pending;
    game.deleteMany({game_Name:'Pending game name'}, function (err,result) {
      if (err) callback(err);
      done();
    });

  })
  after(function (done) {
    var uGame = schemas.Game;
    uGame.deleteMany({game_Name:'Pending game name'}, function (err,result) {
      if (err) callback(err);
      done();
    });
  })
  beforeEach(function (done) {
    const games = new schemas.Pending({
      //UserID needs to be set from the logged on user.
      id:mongoose.Types.ObjectId('5e4bdab0e623ca4e5ca53999'),
      _id: mongoose.Types.ObjectId('5e4bdab0e623ca4e5ca53999'),
      userID: new mongoose.Types.ObjectId,
      game_Name: 'Pending game name',
      game_Summery:'Pending game name',
      game_Rules: 'Pending game name',
      game_Player_Count: 'Pending game name',
      game_Equipment: ['Pending game name'],
      game_IsNSFW:false
   })
   games.save(function (err) {
     if(err)console.log(err);
   });
    var uGame = schemas.Game;
    uGame.deleteMany({game_Name:'Pending game name'}, function (err,result) {
      if (err) callback(err);
      done();
    });
  })

  it('Approving a pending request',function (done) {
    game.game_UID= '5e4bdab0e623ca4e5ca53999',
    game.approvePending(function (err,res) {
      expect(err).to.be.null;
      var pend = schemas.Game;
      pend.findOne({game_Name: 'Pending game name'}).exec(function (err,res) {
        expect(err).to.be.null;
        expect(res).to.not.be.null;
        expect(res).to.have.property('game_Name','Pending game name');
        expect(res).to.have.property('game_Summery','Pending game name');
        expect(res).to.have.property('game_Rules','Pending game name');
        expect(res).to.have.property('game_Player_Count','Pending game name');
        expect(res).to.have.property('game_IsNSFW',false);
      })
      var games = schemas.Pending;
      games.findOne({game_Name: 'Pending game name'}).exec(function (err,res) {
        expect(err).to.be.null;
        expect(res).to.be.null;
        done();
      })
    });
  })
  it('deny a pending request',function (done) {
    game.denyPending('5e4bdab0e623ca4e5ca53999',function (err,result) {
      expect(err).to.be.null;
      var games = schemas.Pending;
      games.findOne({game_Name: 'Pending game name'}).exec(function (err,res) {
        expect(err).to.be.null;
        expect(res).to.be.null;
        done();
      })
    })
  })
})
