const classes = require('../classes');
const expect  = require("chai").expect;
const mongoose = require('mongoose');
var schemas = require("../schemas");
var db = require('../db');


describe('CRUD Bookmark class test',function () {
  const bookmark = new classes.bookmark();
    var bM = schemas.Bookmark;
  after(function () {
    bM.deleteOne({userID:'5e4bdab0e623ca4e5ca53955',gameID:'5e4bdab0e623ca4e5ca53957'},function (err) {
      console.log(err);
    })
  })
  beforeEach(function () {
    bookmark.userID = '5e4bdab0e623ca4e5ca53955';
    bookmark.gameID = '5e4bdab0e623ca4e5ca53957';
  })
  it('create  bookmark',function (done) {
    bookmark.addBookmark(function (err) {
      expect(err).to.be.null;
    });
    setTimeout(function () {
      bM.countDocuments({gameID:'5e4bdab0e623ca4e5ca53957'}).exec(function (err,count) {
        expect(err).to.be.null;
        expect(count).to.equal(1);
      })
    }, 10);

    done();
  })
  it('view bookmarks',function () {
    bookmark.viewBookmark(function (bookmark) {
      expect(bookmark).to.not.be.null;
    })
  })
  it('delete bookmark',function () {
    bookmark.delBookmark(function (err) {
      expect(err).to.be.null;
    })
    bM.countDocuments({gameID:'5e4bdab0e623ca4e5ca53957'}).exec(function (err,count) {
      expect(count).to.equal(0);
    })
  })
})
describe('CRUD Bookmark server test',function () {

})
