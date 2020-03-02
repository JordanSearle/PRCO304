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
    context('Testing login features',function () {
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
          done();
        })
      })
      it('correct Username, incorrect password',function (done) {
        chai.request('http://localhost:9000')
        .post('/login')
        .type('form')
        .send({
          'username':'JTest',
          'password':'password'
        })
        .end(function (err,res) {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res).to.not.include({text:'username'});
          expect(res).to.include({text:'password'});
          done();
        })
      })
      it('correct Username, correct password',function () {
        var agent = chai.request.agent('http://localhost:9000')
        agent
        .post('/login')
        .type('form')
        .send({
          'username':'JTest',
          'password':'12312jhsdf'
        })
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.not.include({text:'username'});
          expect(res).to.not.include({text:'password'});
          expect(res).to.have.cookie('sessionid');
          //Testing returns correct user data
          //Login test
          agent.get('/user')
            .then(function (response) {
              expect(response).to.have.status(200);
              expect(response.text).to.include('"_id":"5e4bdab0e623ca4e5ca53955","username":"JTest","password":"12312jhsdf","email":"email@email.com","user_DOB":"2020-02-18T12:38:08.882Z","__v":0');
            }).catch(function (err) {
              expect(err).to.be.null;
            })
            //Testing log out
          agent.get('/logout')
            .then(function (response) {
              expect(response).to.have.status(200);
            }).catch(function (err) {
              expect(err).to.be.null;
            })
        })
        agent.close();
      })
    })
})
