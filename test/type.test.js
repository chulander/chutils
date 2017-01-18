'use strict';

require('mocha');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const { type:{ is } } = require(path.resolve(__dirname, '../lib'));


describe('type', function () {
  // basic types are
  // 1. null
  // 2. undefined
  // 3. boolean
  // 4. number
  // 5. string
  // 6. object
  // 7. symbol -- added in ES6!
  // ** All of these types except "object" are called "primitives"
  describe('is', () => {
    describe('basic sanity test',()=>{
      it('Expects an function', () => {
        expect(typeof is === 'function').to.be.true;
      });
    })
    describe('basic assertion of the javascript types using typeof', () => {
      it(`expects undefined to return "undefined"`, ()=>{
        expect(is()).to.equal('undefined')
      })
      it(`expects true to return "boolean"`, ()=>{
        expect(is(true)).to.equal('boolean')
      })
      it(`expects 'true' to return "string"`, ()=>{
        expect(is('true')).to.equal('string')
      })
      it(`expects 123 to return "number"`, ()=>{
        expect(is(123)).to.equal('number')
      })
      it(`expects '123' to return "string"`, ()=>{
        expect(is('123')).to.equal('string')
      })
      it(`expects 'chutils to return "string"`, ()=>{
        expect(is('chutils')).to.equal('string')
      })
      it(`expects Symbol('chutils') to return "symbol"`, ()=>{
        expect(is(Symbol('chutils'))).to.equal('symbol')
      })
      it(`expects function(){} to return "function"`, ()=>{
        expect(is(function(){return true})).to.equal('function')
      })
      it(`expects {} to return "object"`, ()=>{
        expect(is({})).to.equal('object')
      })
      it(`expects [1,2,3] to return "object"`, ()=>{
        expect(is({})).to.equal('object')
      })
    })
    describe('handles null', () => {
      it(`expects null to return "null"`, ()=>{
        expect(is(null)).to.equal('null')
      })
    })
    describe('handles array', () => {
      it(`expects [1, 2, 3] to return "array"`, ()=>{
        expect(is([1,2,3])).to.equal('array')
      })
    })
    describe('handles regular expressions in / / format', () => {
      it(`expects /hello/i to return "regexp"`, ()=>{
        expect(is(/hello/i)).to.equal('regexp')

      })
    })
  });
})
