const classes = require('../classes');
const expect  = require("chai").expect;
const mongoose = require('mongoose');
var schemas = require("../schemas");
var db = require('../db');
var chaiHTTP = require('chai-http');
var chai = require('chai');
chai.use(require('chai-match'));
chai.use(chaiHTTP);
const server = 'http://localhost:9000'

describe('CRUD Bookmark class test',function () {
  this.timeout(1000);
  const bookmark = new classes.bookmark();
  const bM = schemas.Bookmark;
  after(function () {
    bM.deleteOne({userID:bookmark.userID,gameID:bookmark.gameID}).exec(function (err) {
      if(err)console.log(err);
    });
  })
  beforeEach(function () {
    bookmark.userID = '5e4bdab0e623ca4e5ca53945';
    bookmark.gameID = '5e4bdab0e623ca4e5ca53999';
  })
  it('create  bookmark',function (done) {
    bookmark.addBookmark(function (err) {
      expect(err).to.be.null;
    });
    setTimeout(function () {
      bM.find({gameID:bookmark.gameID,userID:bookmark.userID}).exec(function (err,count) {
        expect(err).to.be.null;
        expect(count.length).to.equal(1);
        done();
      })
    }, 50);
  })
  it('view bookmarks',function () {
    bookmark.viewBookmark(function (res) {
      expect(res).to.not.be.null;
    })
  })
  it('delete bookmark',function () {
    bookmark.delBookmark(function (err) {
      expect(err).to.be.null;
    })
    bM.countDocuments({gameID:bookmark.gameID}).exec(function (err,count) {
      expect(count).to.equal(0);
    })
  })
})
describe('CRUD Bookmark server test',function () {
  const bM = schemas.Bookmark;const bookmark = new classes.bookmark();
  bookmark.userID = '5e4bdab0e623ca4e5ca53955';
  bookmark.gameID = '5e4bdab0e623ca4e5ca53999';
  after(function () {
    bM.deleteOne({userID:bookmark.userID,gameID:bookmark.gameID}).exec(function (err) {
      if(err)console.log(err);
    });
  })
  it('POST game/bookmark',function () {
    var agent = chai.request.agent(server)
    agent
    .post('/login')
    .type('form')
    .send({
      'username':'UserOne',
      'password':'password'
    })
    .then(function (res) {
    agent.post('/game/bookmark')
    .type('form')
    .send({
      'gameID':'5e4bdab0e623ca4e5ca53999'
    })
    .end(function (err,res) {
      expect(err).to.be.null;
      expect(res).to.have.status(201);
    })
  })
})
  it('get game/bookmark',function () {
    var agent = chai.request.agent(server)
    agent
    .post('/login')
    .type('form')
    .send({
      'username':'UserOne',
      'password':'password'
    })
    .then(function (res) {
    agent.get('/game/bookmark/5e4bdab0e623ca4e5ca53999')
    .end(function (err,res) {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
    })
  })
  })
  it('Delete game/bookmark',function () {
    var agent = chai.request.agent(server)
    agent
    .post('/login')
    .type('form')
    .send({
      'username':'UserOne',
      'password':'password'
    })
    .then(function (res) {
    agent.delete('/game/bookmark')
    .type('form')
    .send({
      'gameID':'5e4bdab0e623ca4e5ca53999'
    })
    .end(function (err,res) {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
    })
  })
  })
})
describe('TAG CRUDS',function () {
  const bookmark = new classes.bookmark();
  const bM = schemas.Bookmark;
  before(function () {
    bookmark.userID = '5e4bdab0e623ca4e5ca54000';
    bookmark.gameID = '5e4bdab0e623ca4e5ca51000';
    bookmark.addBookmark(function (err) {
      expect(err).to.be.null;
    });
  })
  after(function () {
    bM.deleteOne({userID:bookmark.userID,gameID:bookmark.gameID}).exec(function (err) {
      if(err)console.log(err);
    });
  })
  it('adding a tag',function (done) {
    this.timeout = 100;
    var tagname ='Event One'
    bookmark.addTag(tagname,function (err) {
      expect(err).to.be.null;
    });
    setTimeout(function () {
      bM.findOne().exec(function (err,res) {
        expect(err).to.be.null;
        expect(res.tags.length).to.be.above(0);
        expect(res.tags[0].name).to.equal(tagname);
        expect(res.tags[0].name).to.not.equal('Random Characters');
        done();
      })
    }, 50);
  })
  it('removing a tag',function (done) {
    var tagname ='Event One'
    bookmark.delTag(tagname,function (err) {
      expect(err).to.be.null;
    });
    setTimeout(function () {
      bM.findOne().exec(function (err,res) {
        expect(err).to.be.null;
        expect(res.tags.length).to.be.equal(0);
        done();
      })
    }, 50);
  })
})
