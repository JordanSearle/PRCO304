var expect  = require('chai').expect;
var request = require('request');

describe('Testing Server functions',function () {
  context('testing GET HTTP methods',function () {
    it('GET /', function(done) {
        request('http://localhost:9000' , function(error, response, body) {
            expect(body).to.equal('Hello World');
            done();
        });
    });
  })
})
