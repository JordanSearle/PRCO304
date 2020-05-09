var expect = require('chai').expect;
//var request = require('request');
var chai = require('chai');
var chaiHTTP = require('chai-http');
var app = require('../server.js');
const mongoose = require('mongoose');
var schemas = require("../schemas");
var db = require('../db');
var chai = require('chai');
chai.use(require('chai-match'));
chai.use(chaiHTTP);

describe('Testing Server functions', function() {
  before(function (done) {
    var user = schemas.User;
    user.deleteMany({'username':'testUsername'},function (err,res) {
      done();
    })
  })
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
                .get('/game')
                .end(function (err, res) {
                  expect(err).to.be.null;
                  done();
                })
        });
    })
    context('testing CRUD user',function () {
        it('testing creation of a new user',function (done) {
          chai.request('http://localhost:9000')
          .post('/user')
          .send({
            'email':'test@test.com',
            'username':'testUsername',
            'password':'password',
            'user_DOB':'"04 Dec 1995 00:12:00 GMT"'
          })
          .end(function (err,res) {
            expect(err).to.be.null;
            expect(res).to.have.status(201);//Correct status??
            done();
          })
        })
        it('incorrect Username',function (done) {
          chai.request('http://localhost:9000')
          .post('/login')
          .type('form')
          .send({
            'username':'adfsdfsdfa',
            'password':'password1'
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
            'username':'testUsername',
            'password':'password1'
          })
          .end(function (err,res) {
            if(err)console.log(err);
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            expect(res).to.not.include({text:'username'});
            expect(res).to.include({text:'password'});
            done();
          })
        })
        it('correct Username, correct password',function (done) {
          var agent = chai.request.agent('http://localhost:9000')
          agent
          .post('/login')
          .type('form')
          .send({
            'username':'testUsername',
            'password':'password'
          })
          .then(function (res) {
            expect(res).to.have.status(200);
            expect(res).to.not.include({text:'username'});
            expect(res).to.not.include({text:'password'});
            expect(res).to.have.cookie('sessionid');
            //Testing returns correct user data
            agent.get('/user')
              .then(function (response) {
                expect(response).to.have.status(200);
                expect(response.text).to.match(/^(.*),"username":"testUsername",(.*)/);
              }).catch(function (err) {
                if(err)console.log(err);
                expect(err).to.be.null;
              })
          })
          agent.close();
          done();
        })
        it('testing edit user funtion',function (done) {
          var agent = chai.request.agent('http://localhost:9000')
          agent
          .post('/login')
          .type('form')
          .send({
            'username':'testUsername',
            'password':'password'
          })
          .then(function (res) {
            expect(res).to.have.status(200);
            expect(res).to.not.include({text:'username'});
            expect(res).to.not.include({text:'password'});
            expect(res).to.have.cookie('sessionid');
            //Testing returns correct user data
            agent.put('/user')
              .send({
                'username':'testUsername',
                'email':'newEmail@email.com',
                'password':'password',
                'user_DOB':'"04 Dec 1995 00:12:00 GMT"'
              })
              .end(function (err, response) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
              })
          })
          agent.close();
          done();
        })
        it('testing edit delete funtion',function (done) {
          var agent = chai.request.agent('http://localhost:9000')
          agent
          .post('/login')
          .type('form')
          .send({
            'username':'testUsername',
            'password':'password'
          })
          .then(function (res) {
            expect(res).to.have.status(200);
            expect(res).to.not.include({text:'username'});
            expect(res).to.not.include({text:'password'});
            expect(res).to.have.cookie('sessionid');
            //Testing returns correct user data
            agent.delete('/user')
              .then(function (response) {
                expect(res).to.have.status(200);
              })
          })
          agent.close();
          done();
        })
    })
})
