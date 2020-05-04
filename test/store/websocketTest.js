const classes = require('../classes');
const expect  = require("chai").expect;
const mongoose = require('mongoose');
var schemas = require("../schemas");
var db = require('../db');
const WebSocket = require('ws');

describe('testing websocket functions',function () {
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
        'name': 'This is an example game name #2'
      }));
    }
    ws.onmessage = function (event) {
      expect(JSON.parse(event.data).length).to.not.equal(0);
      done();
    }
    ws.onopen = function () {
      ws.send(JSON.stringify({
        'name': 'This is an example game name #2'
      }));
    }
    ws.onmessage = function (event) {
      expect(JSON.parse(event.data).length).to.not.equal(0);
      done();
    }
  })
  it('testing getting prev game',function (done) {
    var ws = new WebSocket("ws://localhost:9000/game/prev");
    ws.onopen = function () {
      ws.send(JSON.stringify({
        'name': 'This is an example game name #2'
      }));
    }
    ws.onmessage = function (event) {
      expect(JSON.parse(event.data).length).to.not.equal(0);
      done();
    }
  })
})
