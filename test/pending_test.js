const classes = require('../classes');
const expect  = require("chai").expect;
const mongoose = require('mongoose');
var schemas = require("../schemas");
var db = require('../db');

describe('Testing, user pending functions',function () {
  before(function () {
    const games = new schemas.Game({
      //UserID needs to be set from the logged on user.
      _id: new mongoose.Types.ObjectId,
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
  })
  afterEach(function (done) {
    var uGame = schemas.Pending;
    uGame.deleteOne({game_Name:'Pending game name'}, function (err,result) {
      if (err) callback(err);
      done();
    });
  })
  var game = new classes.game();
  game.game_UID= new mongoose.Types.ObjectId;
  game.userID= new mongoose.Types.ObjectId;
  game.game_Name= 'Pending game name';
  game.game_Summery='Pending game name';
  game.game_Rules= 'Pending game name';
  game.game_Player_Count= 'Pending game name';
  game.game_Equipment= ['Pending game name'];
  game.game_IsNSFW=false;
  it('User saving the game',function (done) {
    game.addPending(new mongoose.Types.ObjectId,function (err) {
      if(err)console.log(err);
    })
    done();
  })
  it('User suggesting a game edit',function (done) {
    game.editPending(new mongoose.Types.ObjectId,function (err) {
      if(err)console.log(err);
    })
    setTimeout(function () {
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
    }, 15);
  })
})
describe('Testing, admin approving a pendin request functions',function () {
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
    var uGame = schemas.Game;
    uGame.deleteMany({game_Name:'Pending game name'}, function (err,result) {
      if (err) callback(err);
      done();
    });
  })
  before(function (done) {
    const games = new schemas.Pending({
      //UserID needs to be set from the logged on user.
      _id: new mongoose.Types.ObjectId,
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
     done();
   });
  })

  var game = new classes.game();
  game.game_UID= new mongoose.Types.ObjectId;
  game.userID= new mongoose.Types.ObjectId;
  game.game_Name= 'Pending game name';
  game.game_Summery='Pending game name';
  game.game_Rules= 'Pending game name';
  game.game_Player_Count= 'Pending game name';
  game.game_Equipment= ['Pending game name'];
  game.game_IsNSFW=false;

  it('Approving a pending request',function (done) {
    game.approvePending(function (res) {
      console.log(res);
    });
    done();
  })
})
