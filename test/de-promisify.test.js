'use strict';

require('mocha');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const de_promisify = require(path.resolve(__dirname, '../lib/de-promisify'));
const fs = require('fs');
const bluebird = require('bluebird');

describe('de-promisfy', function (){
  this.timeout(7000);
  let successData;
  before(function (done){
    fs.readFile(path.resolve(__dirname, './sample.txt'), 'utf8', function (err, data){
      if(err) done(err);
      else {
        successData = data;
        done();
      }
    });
  });
  describe('functionality', function (){
    const readFileAsync = bluebird.promisify(fs.readFile);
    const testAsync = de_promisify(readFileAsync);
    it('Should be an function', function (){
      expect(typeof de_promisify === 'function').to.be.true;
    });
    it('Should throw an error when called with a non-object', function (){
      try {
        let a = de_promisify(function (){});
      }
      catch (e) {
        expect(e instanceof Error).to.be.true;
      }
    });
    it('Should run last argument as a callback', function (done){
      this.timeout(7000);
      testAsync(path.resolve(__dirname, './sample.txt'), 'utf8', function (err, data){
        if(!err) {
          expect(data).to.equal(successData);
          done();
        } else {
          done(err);
        }

      });
    });
    it('Should handle error if last argument is a callback', function (done){
      this.timeout(7000);
      testAsync(path.resolve(__dirname, './doesNotExist.txt'), 'utf8', function (err, data){
        expect(err).to.be.instanceOf(Error);
        done();
      });
    });

    it('Should call original function if last argument is not a callback function', function(done){
      const sillyFunc = function(a,b,c){
        return a+b+c;
      };
      const depromsifySillyFunc = de_promisify(sillyFunc);
      expect(depromsifySillyFunc(1,2,3)).to.equal(6);
      done();
    })
  });
});
