var expect = require('chai').expect;
var classes = require('../classes');
var factory = require('../serverFunctions');

describe('testing factory methods',function () {
  this.timeout(200);
  it('testing with logged out user',function (done) {
    var fac = new factory.factory();
    //if req.session.id == undefined
    fac.create(undefined).then(function (id) {
      expect(id).to.not.be.null;
      expect(id).to.equal('test');
      done();
    });
  })
  it('testing with logged in user',function (done) {
    var fac = new factory.factory();
    fac.create(false).then(function (id) {
      expect(id).to.not.be.null;
      expect(id).to.be.an.instanceof(classes.user);
      done();
    });
  })
  it('testing with logged in admin',function (done) {
    var fac = new factory.factory();
    fac.create(true).then(function (id) {
      expect(id).to.not.be.null;
      expect(id).to.be.an.instanceof(classes.admin);
      done();
    });
  })
  it('testing with no user ID value',function (done) {
    var fac = new factory.factory();
    fac.create().then(function (id) {
      expect(id).to.not.be.null;
      expect(id).to.equal('test');
      done();
    });
  })
  it('testing with no matching ID value in database',function (done) {
    var fac = new factory.factory();
    //Not complete yet
    fac.create('n074r34l1d').then(function (id) {
      expect(id).to.not.be.null;
      expect(id).to.equal('test');
      done();
    });
  })
})
