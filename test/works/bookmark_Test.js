const classes = require('../classes');
const expect  = require("chai").expect;
const mongoose = require('mongoose');
var schemas = require("../schemas");
var db = require('../db');
var chaiHTTP = require('chai-http');
var chai = require('chai');
chai.use(require('chai-match'));
chai.use(chaiHTTP);
var server = require('../server');


describe('CRUD Bookmark class test',function () {
  const bookmark = new classes.bookmark();
  const bM = schemas.Bookmark;
  before(function () {
    before(done =>{
      server.on( "app_started", function()
      {
        done();
      })
    })
  })
  after(function () {
    bM.deleteOne({userID:bookmark.userID,gameID:bookmark.gameID}).exec(function (err) {
      expect(err).to.be.null;
    });
  })
  it('create  bookmark',function (done) {
    bookmark.userID = '5e4bdab0e623ca4e5ca53945';
    bookmark.gameID = '5e4bdab0e623ca4e5ca53991';
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
    bookmark.userID = '5e4bdab0e623ca4e5ca53945';
    bookmark.gameID = '5e4bdab0e623ca4e5ca53991';
    bookmark.viewBookmark(function (res) {
      expect(res).to.not.be.null;
    })
  })
  it('delete bookmark',function (done) {
    bookmark.userID = '5e4bdab0e623ca4e5ca53945';
    bookmark.gameID = '5e4bdab0e623ca4e5ca53991';
    bookmark.delBookmark(function (err,res) {
      expect(err).to.be.null;
      bM.countDocuments({gameID:bookmark.gameID}).exec(function (err,count) {
        expect(count).to.equal(0);
        done()
      })
    })
  })
})
describe('CRUD Bookmark server test',function () {
  const bM = schemas.Bookmark;const bookmark = new classes.bookmark();
  bookmark.userID = '5e4bdab0e623ca4e5ca53945';
  bookmark.gameID = '5e4bdab0e623ca4e5ca53991';
  before(function () {
    before(done =>{
      server.on( "app_started", function()
      {
        done();
      })
    })
  })
  after(function () {
    bM.deleteOne({userID:bookmark.userID,gameID:bookmark.gameID}).exec(function (err) {
      expect(err).to.be.null;
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
    before(done =>{
      server.on( "app_started", function()
      {
        done();
      })
    })
  })
  beforeEach(function (done) {
    bookmark.userID = '5e4bdab0e623ca4e5ca54000';
    bookmark.gameID = '5e4bdab0e623ca4e5ca51000';
    bookmark.tags = [];
    bookmark.addBookmark(function (err,res) {
      expect(err).to.be.null;
      done();
    });
  })
  after(function () {
    bM.deleteOne({userID:bookmark.userID,gameID:bookmark.gameID}).exec(function (err) {
      expect(err).to.be.null;
    });
  })
  afterEach(function (done) {
    bookmark.userID = '5e4bdab0e623ca4e5ca54000';
    bookmark.gameID = '5e4bdab0e623ca4e5ca51000';
    bookmark.delBookmark(function (err,res) {
      expect(err).to.be.null;
      done();
    });
  })

  it('adding a tag',function (done) {
    bookmark.userID = '5e4bdab0e623ca4e5ca54000';
    bookmark.gameID = '5e4bdab0e623ca4e5ca51000';
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
describe('delete Tags',function () {
  const bookmark = new classes.bookmark();
  const bM = schemas.Bookmark;
  before(function () {
    //Needs double before for no reason
    before(done =>{
      server.on( "app_started", function()
      {
        bookmark.userID = '5e4bdab0e623ca4e5ca54000';
        bookmark.gameID = '5e4bdab0e623ca4e5ca51000';
        bookmark.addBookmark(function (err,done) {
          expect(err).to.be.null;
          done();
        });
      })
    })
  })
  after(function () {
    bM.deleteOne({userID:bookmark.userID,gameID:bookmark.gameID}).exec(function (err) {
      expect(err).to.be.null;
    });
  })

})
