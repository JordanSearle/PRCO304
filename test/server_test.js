var expect  = require('chai').expect;
//var request = require('request');
var chai = require('chai');
var chaiHTTP = require('chai-http');
var app = require('../server.js');
chai.use(chaiHTTP);

describe('Testing Server functions',function () {
  context('testing GET HTTP methods',function () {
    it('GET /', function(done) {
      /*  request('http://localhost:9000' , function(error, response, body) {
            expect(body).to.equal('Hello World');
            done();
        });*/
        chai.request('http://localhost:9000')
          .get('/')
          .end(function (err, res) {
             expect(err).to.be.null;
             expect(res).to.have.status(200);
          });
          chai.request('http://localhost:9000')
            .get('/asa')
            .end(function (err, res) {
               expect(err).to.be.null;
               expect(res).to.have.status(404);
               done();
            });
            chai.request('http://localhost:9000')
            .post('/writegame')
            .type('form')
            .send({
              '_method': 'put',
              'name': '123',
              'summery': '123',
              'rules': '123',
              'pcount': '123',
              'summery': ['123']
            })
            .then(function (res) {
              console.log(res.body);
              expect(res).to.have.cookie('sessionid');
            })

    });
  })
})
