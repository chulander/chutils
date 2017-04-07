'use strict'
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */

require('mocha')
const path = require('path')
const chai = require('chai')
const capitalize = require('capitalize')
const expect = chai.expect
const {
  compare: {
    value,
    shouldBe
  },
  safe: {
    assign
  }
} = require(path.resolve(__dirname, '../lib'))
const fs = require('fs')
const bluebird = require('bluebird')
const {test: {getSource}} = require(path.join(__dirname, '../utility'))
const source=getSource()
describe('compare', function () {
  const _root = 'nested'
  const _primitive = 'primitive'
  const _object = 'obj'
  const _array = 'arr'
  const _firstLayer = 'firstLayer'
  const _secondLayer = 'secondLayer'
  const createNestedProps = (...args) => args.map(item => item).join('.')

  const firstLayerPropPrimitive = createNestedProps(_root, _firstLayer, _primitive)
  const firstLayerPropArray = createNestedProps(_root, _firstLayer, _array)
  const firstLayerPropObject = createNestedProps(_root, _firstLayer, _object)
  const firstLayerPropObjectPropPrimitive = createNestedProps(_root, _firstLayer, _object, _primitive)
  const firstLayerPropObjectPropArray = createNestedProps(_root, _firstLayer, _object, _array)
  const firstLayer = createNestedProps(_root, _firstLayer)

  const secondLayerPropPrimitive = createNestedProps(_root, _firstLayer, _secondLayer, _primitive)
  const secondLayerPropArray = createNestedProps(_root, _firstLayer, _secondLayer, _array)
  const secondLayerPropObject = createNestedProps(_root, _firstLayer, _secondLayer, _object)
  const secondLayerPropObjectPropPrimitive = createNestedProps(_root, _firstLayer, _secondLayer, _object, _primitive)
  const secondLayerPropObjectPropArray = createNestedProps(_root, _firstLayer, _secondLayer, _object, _array)
  const secondLayerPropNumberAsKey = createNestedProps(_root, _firstLayer, _secondLayer, '0')

  const propFirstLayer = createNestedProps(_root, _firstLayer)
  const propSecondLayer = createNestedProps(_root, _firstLayer, _secondLayer)

  describe('value', () => {
    it('Expects to be a function', () => {
      expect(typeof value === 'function').to.be.true
    })
    it('Expects a TypeError when invoked with argument "object" that is not an Object', () => {
      try {
        value(null, 'deep.property.check', 'anything')
      } catch (e) {
        expect(e instanceof TypeError).to.be.true
      }
    })
    it('Expects a TypeError when invoked with argument "assignment" that is not an String', () => {
      try {
        value(source, null, 'anything')
      } catch (e) {
        expect(e instanceof TypeError).to.be.true
      }
    })
    it('Expects a TypeError when invoked with argument "val" that is not an primitive', () => {
      try {
        value(source, 'deep.property.check', { name: 'anything' })
      } catch (e) {
        expect(e instanceof TypeError).to.be.true
      }
    })
    it('Expects true if the nested property value equals the expected value', () => {
      expect(value(source, 'nested.firstLayer.secondLayer.primitive', 'secondLayerPrimitive')).to.be.true
    })
    it(`Expects true if the nested property value equals the expected value even if the argument "assignment" contains [,],", or ' object property notations`, () => {
      expect(value(source, `nested['firstLayer']["secondLayer"].primitive`, 'secondLayerPrimitive')).to.be.true
    })
    it('Expects false if the nested property value do not equal the expected property value', () => {
      expect(value(source, 'nested.deep.property.value', 'falseyValue')).to.be.false
    })
    it('Expects false if nested property do not exist', () => {
      expect(value(source, 'does.not.exist.property', 'test')).to.be.false
    })
  })
  describe('shouldBe', () => {
    it('Expects type to be a "string"', () => {
      expect(shouldBe(source, `${propFirstLayer}.primitive`, 'string')).to.be.true
    })
    it('Expects type to be a "null"', () => {
      const deepProp = `${propFirstLayer}.shouldBeNull`
      const testObj = assign(source, deepProp, null)
      expect(shouldBe(testObj, deepProp, 'null')).to.be.true
    })
    it('Expects type to be a Promise', ()=>{
      expect(shouldBe(source,`${secondLayerPropObject}.promiseObj`,'promise'))
    })
  })
})
