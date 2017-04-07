'use strict'
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */

require('mocha')
const path = require('path')
const chai = require('chai')
const expect = chai.expect
const fs = require('fs')
const {type: {shouldBe}} = require(path.resolve(__dirname, '../lib'))
const bluebird = require('bluebird')
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
  describe('shouldBe', () => {
    describe('basic sanity test', () => {
      it('Expects an function', () => {
        expect(typeof shouldBe === 'function').to.be.true
      })
    })
    describe('basic assertion of the javascript types using typeof', () => {
      it(`expects undefined to return "undefined"`, () => {
        expect(shouldBe()).to.equal('undefined')
      })
      it(`expects true to return "boolean"`, () => {
        expect(shouldBe(true)).to.equal('boolean')
      })
      it(`expects 'true' to return "string"`, () => {
        expect(shouldBe('true')).to.equal('string')
      })
      it(`expects 123 to return "number"`, () => {
        expect(shouldBe(123)).to.equal('number')
      })
      it(`expects '123' to return "string"`, () => {
        expect(shouldBe('123')).to.equal('string')
      })
      it(`expects 'chutils to return "string"`, () => {
        expect(shouldBe('chutils')).to.equal('string')
      })
      it(`expects Symbol('chutils') to return "symbol"`, () => {
        expect(shouldBe(Symbol('chutils'))).to.equal('symbol')
      })
      it(`expects function(){} to return "function"`, () => {
        expect(shouldBe(function () { return true })).to.equal('function')
      })
      it(`expects {} to return "object"`, () => {
        expect(shouldBe({})).to.equal('object')
      })
      it(`expects [1,2,3] to return "object"`, () => {
        expect(shouldBe({})).to.equal('object')
      })
    })
    describe('handles null', () => {
      it(`expects null to return "null"`, () => {
        expect(shouldBe(null)).to.equal('null')
      })
    })
    describe('handles array', () => {
      it(`expects [1, 2, 3] to return "array"`, () => {
        expect(shouldBe([1, 2, 3])).to.equal('array')
      })
    })
    describe('handles regular expressions in /regexPattern/ format', () => {
      it(`expects /hello/i to return "regexp"`, () => {
        expect(shouldBe(/hello/i)).to.equal('regexp')
      })
    })
    describe('handles ES6 promise', () => {
      it(`expects new Promise((success=>{},error=>{})) to return "promise"`, () => {
        const promise = new Promise((success => {}, error => { console.log('error:', error) }))
        expect(shouldBe(promise)).to.equal('promise')
      })
    })
    describe('handles bluebird promise', () => {
      it(`expects new bluebird.Promise((success=>{},error=>{})) to return "promise"`, () => {
        const promise = new bluebird.Promise((success => {}, error => { console.log('error:', error) }))
        expect(shouldBe(promise)).to.equal('promise')
      })
    })
    describe('handles bluebird promisified callback functions', () => {
      it(`expects new bluebird.promisify(someCallbackFunc) to return "promise"`, () => {
        const readFileAsyncBlueBird = bluebird.promisify(fs.readFile)
        const pathToFile = path.join(__dirname, './sample.txt')
        expect(shouldBe(readFileAsyncBlueBird(pathToFile))).to.equal('promise')
      })
    })
    describe('handles functions', () => {
      it(`expects function to return "function"`, () => {})
      const testFunc = function () {
        expect(shouldBe(testFunc)).to.equal('function')
      }
    })
    describe('handles JSON', () => {
      it(`expects JSON to return "json"`, () => {
        const testObj = {
          package: 'chutils'
        }
        const testJSON = JSON.stringify(testObj)

        expect(shouldBe(testJSON)).to.equal('json')
      })
      it(`expects {package:'chutils'} to return "object" and not JSON`, () => {
        const testObj = {
          package: 'chutils'
        }
        expect(shouldBe(testObj)).to.equal('object')
      })
    })
  })
})
