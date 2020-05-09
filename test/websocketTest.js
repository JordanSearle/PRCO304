const classes = require('../classes');
const expect  = require("chai").expect;
const mongoose = require('mongoose');
var schemas = require("../schemas");
var db = require('../db');
const WebSocket = require('ws');
var server = require('../server')

describe('testing websocket functions',function () {
  var gameList = [
    {
      _id: new mongoose.Types.ObjectId,
      userID:new mongoose.Types.ObjectId,
      game_Name:'Test:This is an example game name #1',
      game_Summery:'game sum',
      game_Rules:'rules',
      game_Player_Count:'1+',
      game_Equipment:['test1','test3'],
      game_Categories:{},
      game_IsNSFW:false,
      ratingCount:0,
      rating:[]
    },
    {
      _id: new mongoose.Types.ObjectId,
      userID:new mongoose.Types.ObjectId,
      game_Name:'Test:This is an example game name #2',
      game_Summery:'game sum',
      game_Rules:'rules',
      game_Player_Count:'1+',
      game_Equipment:['test1','test3'],
      game_Categories:{},
      game_IsNSFW:false,
      ratingCount:0,
      rating:[]
    },
    {
      _id: new mongoose.Types.ObjectId,
      userID:new mongoose.Types.ObjectId,
      game_Name:'Test:This is an example game name #3',
      game_Summery:'game sum',
      game_Rules:'rules',
      game_Player_Count:'1+',
      game_Equipment:['test1','test3'],
      game_Categories:{},
      game_IsNSFW:false,
      ratingCount:0,
      rating:[]
    }]
  before(function (done) {
    var game = schemas.Game;
    var gameList = [
      {
        _id: new mongoose.Types.ObjectId,
        userID:new mongoose.Types.ObjectId,
        game_Name:'Test:This is an example game name #1',
        game_Summery:'game sum',
        game_Rules:'rules',
        game_Player_Count:'1+',
        game_Equipment:['test1','test3'],
        game_Categories:{},
        game_IsNSFW:false,
        ratingCount:0,
        rating:[]
      },
      {
        _id: new mongoose.Types.ObjectId,
        userID:new mongoose.Types.ObjectId,
        game_Name:'Test:This is an example game name #2',
        game_Summery:'game sum',
        game_Rules:'rules',
        game_Player_Count:'1+',
        game_Equipment:['test1','test3'],
        game_Categories:{},
        game_IsNSFW:false,
        ratingCount:0,
        rating:[]
      },
      {
        _id: new mongoose.Types.ObjectId,
        userID:new mongoose.Types.ObjectId,
        game_Name:'Test:This is an example game name #3',
        game_Summery:'game sum',
        game_Rules:'rules',
        game_Player_Count:'1+',
        game_Equipment:['test1','test3'],
        game_Categories:{},
        game_IsNSFW:false,
        ratingCount:0,
        rating:[]
      }]
      game.insertMany(gameList,function (err,res) {
        done();
      })
  })
  after(function (done) {
    var game = schemas.Game;
    game.deleteMany(gameList,function (err,res) {
      done();
    })
  })
  it('testing getting a random game',function (done) {
    var ws = new WebSocket("ws://localhost:9000/game/random");
    ws.onopen = function () {
      ws.send(JSON.stringify({
        'rand': "random"
      }));
    }
    ws.onmessage = function (event) {
      expect(JSON.parse(event.data)).to.not.be.null;
      done();
    }
  })
  it('testing getting next game',function (done) {
    var ws = new WebSocket("ws://localhost:9000/game/next");
    ws.onopen = function () {
      ws.send(JSON.stringify({
        'name': 'Test:This is an example game name #2'
      }));
    }
    ws.onmessage = function (event) {
      expect(JSON.parse(event.data)[0].game_Name).to.equal('Test:This is an example game name #3');
      done();
    }
  })
  it('testing getting prev game',function (done) {
    var ws = new WebSocket("ws://localhost:9000/game/prev");
    ws.onopen = function () {
      ws.send(JSON.stringify({
        'name': 'Test:This is an example game name #2'
      }));
    }
    ws.onmessage = function (event) {
      expect(JSON.parse(event.data)[0].game_Name).to.equal('Test:This is an example game name #1');
      done();
    }
  })
})
