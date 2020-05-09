const classes = require('../classes');
const expect  = require("chai").expect;
const mongoose = require('mongoose');
var schemas = require("../schemas");
var db = require('../db');
var chaiHTTP = require('chai-http');
var chai = require('chai');
chai.use(require('chai-match'));
chai.use(chaiHTTP);
const server = require('../server');

describe('CRUD Bookmark class test',function () {
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
    bookmark.addBookmark(function (err,res) {
      expect(err).to.be.null;
      bM.find({gameID:bookmark.gameID,userID:bookmark.userID}).exec(function (err,count) {
        expect(err).to.be.null;
        expect(count.length).to.equal(1);
        done();
      })
    });
  })
  it('view bookmarks',function () {
    bookmark.viewBookmark(function (err,res) {
      expect(err).to.be.null;
      expect(res).to.not.be.null
    })
  })
  it('delete bookmark',function () {
    bookmark.delBookmark(function (err,res) {
      expect(err).to.be.null;
      bM.countDocuments({gameID:bookmark.gameID}).exec(function (err,count) {
        expect(count).to.equal(0);
      })
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
  it('POST game/bookmark',function (done) {
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
      done();
    })
  })
})
  it('Delete game/bookmark',function (done) {
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
      done();
    })
  })
  })
})

describe('TAG CRUDS',function () {
  const bookmark = new classes.bookmark();
  bookmark.userID = '5e4bdab0e623ca4e5ca53955';
  bookmark.gameID = '5e4bdab0e623ca4e5ca53999';
  const bM = schemas.Bookmark;
  before(function (done) {
    var bookmark = new schemas.Bookmark({
      userID:mongoose.Types.ObjectId('5e4bdab0e623ca4e5ca53955'),
      gameID:mongoose.Types.ObjectId('5e4bdab0e623ca4e5ca53999')
    })
    bookmark.save(function (err,res) {
        done()
    })
  })
  after(function (done) {
    bM.deleteOne({userID:bookmark.userID,gameID:bookmark.gameID}).exec(function (err) {
      done();
    });
  })
  it('adding a tag',function (done) {
    var tagname ='Event One'
    bookmark.addTag(tagname,function (err,res) {
      expect(err).to.be.null;
      bM.findOne({userID:bookmark.userID,gameID:bookmark.gameID}).exec(function (err,res) {
        expect(err).to.be.null;
        expect(res.tags.length).to.be.above(0);
        expect(res.tags[0].name).to.equal(tagname);
        expect(res.tags[0].name).to.not.equal('Random Characters');
        done();
      })
    });
  })
  it('removing a tag',function (done) {
    var tagname ='Event One'
    bookmark.delTag(tagname,function (err,res) {
      expect(err).to.be.null;
      bM.findOne({userID:bookmark.userID,gameID:bookmark.gameID}).exec(function (err,res) {
        expect(err).to.be.null;
        expect(res.tags.length).to.be.equal(0);
        done();
      })
    });
  })
})
