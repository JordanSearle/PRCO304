var expect = require('chai').expect;
//var request = require('request');
var chai = require('chai');
var chaiHTTP = require('chai-http');
var app = require('../server.js');
chai.use(chaiHTTP);

describe('Testing Server functions', function() {
    context('testing GET HTTP request', function() {
        it('/ test', function(done) {
            chai.request('http://localhost:9000')
                .get('/')
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                });
            chai.request('http://localhost:9000')
                .get('/404')
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(404);
                    done()
                });
        })
        it('/readGames test', function(done) {
            chai.request('http://localhost:9000')
                .get('/readgames')
                .end(function (err, res) {
                  expect(err).to.be.null;
                  done();
                })
        });
    })
    context('testing POST HTTP request',function () {
      it('/ POST test', function(done) {
          chai.request('http://localhost:9000')
              .post('/writegame')
              .type('form')
              .send({
                  'name': '123',
                  'summery': '123',
                  'rules': '123',
                  'pcount': '1-3',
                  'equipment': ['123'],
                  'nsfw':true
              })
              .end(function(err, res) {
                  expect(err).to.be.null;
                  expect(res).to.have.status(201);
                  done();
              })
      });
    })
    context('Testing login',function () {
      it('incorrect Username',function (done) {
        chai.request('http://localhost:9000')
        .post('/login')
        .type('form')
        .send({
          'username':'test',
          'password':'password'
        })
        .end(function (err,res) {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res).to.include({text:'username'});
          expect(res).to.not.include({text:'password'});
          expect(res).to.not.include({text:true});
          done();
        })
      })
    })
})
