'use strict'
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */

require('mocha')
const path = require('path')
const chai = require('chai')
const expect = chai.expect
const {
  async: {
    promisify,
    dePromisify,
    promisifyAll,
    dePromisifyAll
  }
} = require(path.resolve(__dirname, '../lib'))

const bluebird = require('bluebird')

describe('dePromisify', function () {
  this.timeout(7000)
  let successData
  const fs = require('fs')
  before(function (done) {
    fs.readFile(path.resolve(__dirname, './sample.txt'), 'utf8', function (err, data) {
      if (err) done(err)
      else {
        successData = data
        done()
      }
    })
  })
  describe('functionality', function () {
    const readFileAsyncBlueBird = bluebird.promisify(fs.readFile)
    const readFileCB = dePromisify(readFileAsyncBlueBird)
    it('Should be an function', function () {
      expect(typeof dePromisify === 'function').to.be.true
    })
    it('Should throw an error when called with a non-object', function () {
      try {
        let a = dePromisify(function () {})
      } catch (e) {
        expect(e instanceof Error).to.be.true
      }
    })
    it('Should run last argument as a callback', function (done) {
      this.timeout(7000)
      readFileCB(path.resolve(__dirname, './sample.txt'), 'utf8', function (err, data) {
        if (!err) {
          expect(data).to.equal(successData)
          done()
        } else {
          done(err)
        }
      })
    })
    it('Should handle errors', function (done) {
      this.timeout(7000)
      readFileCB(path.resolve(__dirname, './doesNotExist.txt'), 'utf8', function (err, data) {
        expect(err).to.be.instanceOf(Error)
        done()
      })
    })

    it('Should call original function if last argument is not a callback function', function (done) {
      const sillyFunc = function (a, b, c) {
        return a + b + c
      }
      const depromsifySillyFunc = dePromisify(sillyFunc)
      expect(depromsifySillyFunc(1, 2, 3)).to.equal(6)
      done()
    })
  })
})
describe('promisify', function () {
  this.timeout(7000)
  let successData
  const fs = require('fs')
  before(function (done) {
    fs.readFile(path.resolve(__dirname, './sample.txt'), 'utf8', function (err, data) {
      if (err) done(err)
      else {
        successData = data
        done()
      }
    })
  })
  describe('functionality', function () {
    // const readFileAsync = bluebird(fs.readFile);
    const readFileAsync = promisify(fs.readFile)
    it('Should be an function', function () {
      expect(typeof promisify === 'function').to.be.true
    })
    it('Should throw an error when called with a non-function', function () {
      try {
        let a = promisify({})
      } catch (e) {
        expect(e instanceof Error).to.be.true
      }
    })
    it('Should run last argument as a callback', function (done) {
      this.timeout(7000)
      console.log('what is readFileAsync', readFileAsync)
      readFileAsync(path.join(__dirname, './sample.txt'))
      .then(data => {
        expect(data.toString()).to.equal(successData)
        done()
      })
      .catch(err => done(err))
    })
    it('Should handle errors', function (done) {
      this.timeout(7000)
      readFileAsync(path.resolve(__dirname, './doesNotExist.txt'))
      .catch(err => {
        expect(err).to.be.instanceOf(Error)
        done()
      })
    })
  })
})
describe('promisifyAll', function () {
  this.timeout(7000)
  let successData
  let fs2
  before(function (done) {
    const fs = require('fs')
    fs2 = promisifyAll(fs)
    fs.readFile(path.resolve(__dirname, './sample.txt'), 'utf8', function (err, data) {
      if (err) done(err)
      else {
        successData = data
        done()
      }
    })
  })
  describe('functionality', function () {
    // const readFileAsync = bluebird(fs.readFile);
    it('Should be an function', function () {
      expect(typeof promisifyAll === 'function').to.be.true
    })
    it('Should throw an error when called with a non-object', function () {
      try {
        let a = promisifyAll(function () { return 'testing' })
      } catch (e) {
        expect(e instanceof Error).to.be.true
      }
    })
    it('Should run add the default suffix "Async" to the end of each function', function (done) {
      this.timeout(7000)

      const AsyncFunctionExist = Object.keys(fs2).some(key => {
        return key.substr(key.length - 5) === 'Async'
      })
      expect(AsyncFunctionExist).to.be.true
      done()
    })
    it('Should behave just as the normal promisify function', function (done) {
      this.timeout(7000)
      fs2.readFileAsync(path.join(__dirname, './sample.txt'))
      .then(data => {
        expect(data.toString()).to.equal(successData)
        done()
      })
      .catch(err => done(err))
    })
  })
})
describe('dePromisifyAll', function () {
  this.timeout(7000)
  let successData
  const fs = require('fs')
  const fsAsync = promisifyAll(fs)
  const fsCB = dePromisifyAll(fsAsync)
  Object.keys(fsCB).forEach(key => {
    console.log('what is regular cbKey', key)
    if (key.substr(key.length - 2) === 'CB') {
      console.log('what is cbKey', key)
    }
  })
  before(function (done) {
    fs.readFile(path.resolve(__dirname, './sample.txt'), 'utf8', function (err, data) {
      if (err) done(err)
      else {
        successData = data
        done()
      }
    })
  })
  describe('functionality', function () {
    // const readFileAsync = bluebird(fs.readFile);
    it('Should be an function', function () {
      expect(typeof dePromisifyAll === 'function').to.be.true
    })
    it('Should throw an error when called with a non-object', function () {
      try {
        let a = promisifyAll(function () { return 'testing' })
      } catch (e) {
        expect(e instanceof Error).to.be.true
      }
    })
    it('Should run add the default suffix "CB" to the end of each function', function (done) {
      this.timeout(7000)

      const cbFunctionExist = Object.keys(fsCB).some(key => {
        return key.substr(key.length - 2) === 'CB'
      })
      expect(cbFunctionExist).to.be.true
      done()
    })
    it('Existing Async-suffixed functions should still exist', function (done) {
      this.timeout(7000)

      const asyncFunctionExist = Object.keys(fsCB).some(key => {
        return key.substr(key.length - 5) === 'Async'
      })
      expect(asyncFunctionExist).to.be.true
      done()
    })
    it('Should behave just as the normal dePromisify function', function (done) {
      this.timeout(7000)
      fsCB.readFileCB(path.resolve(__dirname, './sample.txt'), 'utf8', function (err, data) {
        if (err) done(err)
        else {
          successData = data
          done()
        }
      })
    })
  })
})
