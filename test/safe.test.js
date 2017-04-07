'use strict'
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */

require('mocha')
const path = require('path')
const chai = require('chai')
const capitalize = require('capitalize')
const expect = chai.expect
const {
  safe: {
    assign,
    get
  }
} = require(path.resolve(__dirname, '../lib'))
const fs = require('fs')
const bluebird = require('bluebird')
const {test: {getSource}} = require(path.join(__dirname, '../utility'))

const source = getSource()
describe('safe', function () {
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

  describe('assign', () => {
    const propValue = 'assignPropValue'
    const propObj = {primitive: propValue}
    describe('sanity checks', () => {
      it('Expects an function', () => {
        expect(typeof assign === 'function').to.be.true
      })
      it('Expects a TypeError when invoked with argument "assignment" that is not an string', () => {
        try {
          assign(source, null, 'anything')
        } catch (e) {
          expect(e instanceof TypeError).to.be.true
        }
      })
    })
    describe('obvious cases', () => {
      describe('nested property do not exist', () => {
        const deepProp = 'my.new.prop'
        it('Expects primitive values to be added', () => {
          const newObj = assign(source, deepProp, propValue)
          expect(newObj).to.have.deep.property(`${deepProp}`, propValue)
        })
        it('Expects objects to be added', () => {
          const newObj = assign(source, deepProp, propObj)
          expect(newObj).to.have.deep.property(`${deepProp}.${Object.keys(propObj)[0]}`, `${propObj[Object.keys(propObj)[0]]}`)
        })
        it('Expects array to be added', () => {
          const newObj = assign(source, deepProp, [propObj])
          expect(newObj).to.have.deep.property(`${deepProp}[0].${Object.keys(propObj)[0]}`, `${propObj[Object.keys(propObj)[0]]}`)
        })
        it('Expects function to be added', () => {
          const newObj = assign(source, deepProp, function () { return propObj })
          const testFunc = get(newObj, deepProp)
          expect(testFunc).to.be.an('function')
          // expect(testFunc).to.be.an('object');
          // expect(testFunc).to.have.deep.property('primitive', propValue)
        })
      })
      describe('nested property exist', () => {
        describe('property level: firstLayer', () => {
          const deepProp = `${propFirstLayer}.deepProp`
          describe('primitives', () => {
            let newObj
            before(() => {
              newObj = assign(source, deepProp, propValue)
            })
            it('Expects primitive values to be added', () => {
              expect(newObj.nested.firstLayer.deepProp).to.equal(propValue)
            })
            it('Expects nested property along the path to still exist', () => {
              expect(newObj).to.have.deep.property('nested.firstLayer.arr')
            })
            it('Expects nested property value along the path to still exist', () => {
              expect(newObj).to.have.deep.property('nested.firstLayer.arr[1].name', 'randomLastName')
            })
          })
          describe('objects', () => {
            const newObj = assign(source, deepProp, propObj)
            it('Expects objects to be added', () => {
              expect(newObj).to.have.deep.property(`${deepProp}.primitive`, propValue)
            })
            it('Expects nested property along the path to still exist', () => {
              expect(newObj).to.have.deep.property('nested.firstLayer.primitive')
            })
            it('Expects nested property value along the path to still exist', () => {
              expect(newObj).to.have.deep.property('nested.firstLayer.primitive', 'firstLayerPrimitive')
            })
          })
        })
      })
    })
    describe('edge cases', () => {
      describe('nested property do exist', () => {
        describe('property level: firstLayer', () => {
          it('Expects adding a primitive value to result in an error', () => {
            try {
              assign(source, propFirstLayer, propValue)
            } catch (e) {
              expect(e instanceof Error).to.be.true
            }
          })
          it('Expects adding a object to result in an error', () => {
            try {
              assign(source, propFirstLayer, propObj)
            } catch (e) {
              expect(e instanceof Error).to.be.true
            }
          })
          it('Expects adding a deep object to result in an error', () => {
            try {
              assign(source, propSecondLayer, propObj)
            } catch (e) {
              expect(e instanceof Error).to.be.true
            }
          })
        })
        describe('property level: second_layer', () => {
          let newObj
          const deepProp = `${propSecondLayer}.deepProp`
          before(() => {
            newObj = assign(source, deepProp, propValue)
          })
          it('Expects adding a primitive value to result in an error', () => {
            try {
              assign(source, propSecondLayer, propValue)
            } catch (e) {
              expect(e instanceof Error).to.be.true
            }
          })
          it('Expects object assignments to merge with existing properties', () => {
            expect(get(newObj, `${deepProp}`)).to.equal(propValue)
          })
          it('Expects nested property along the path to still exist', () => {
            expect(newObj).to.have.deep.property(`${propFirstLayer}.${Object.keys(propObj)[0]}`)
          })
          it('Expects nested property value along the path to still exist', () => {
            expect(newObj).to.have.deep.property(`${propSecondLayer}.${Object.keys(propObj)[0]}`, 'secondLayerPrimitive')
          })
        })
      })
    })
    describe('opinionated cases', () => {
      describe('arrays', () => {
        const deepProp = `${propFirstLayer}.arr`
        const arrayLength = get(source, `${deepProp}`).length
        describe('existing property is an array', () => {
          let testElementObj
          let testElementPrimitive
          let testElementArray
          before(() => {
            testElementObj = assign(source, deepProp, propObj)
            testElementPrimitive = assign(source, deepProp, propValue)
            testElementArray = assign(source, deepProp, [propObj])
          })
          it('Expects the array length to increase after element object is assigned', () => {
            const newArrayLength = get(testElementObj, `${deepProp}`).length
            expect(newArrayLength - arrayLength).to.equal(1)
          })
          it('Expects the last element of the array to be the correct object ', () => {
            const testArrayElement = get(testElementObj, `${deepProp}`).pop()
            expect(testArrayElement).to.be.an('object')
            expect(testArrayElement).to.have.deep.property(`${Object.keys(propObj)[0]}`, propValue)
          })
          it('expects the array length to increase after element primitive value is assigned', () => {
            const newArrayLength = get(testElementPrimitive, `${deepProp}`).length
            expect(newArrayLength - arrayLength).to.equal(1)
          })
          it('Expects the last element of the array to be the correct primitive value ', () => {
            const testArrayElement = get(testElementPrimitive, `${deepProp}`).pop()
            expect(testArrayElement).to.be.an('string')
            expect(testArrayElement).to.equal(propValue)
          })
          it('expects the array length to increase after element array is assigned', () => {
            const newArrayLength = get(testElementArray, `${deepProp}`).length
            expect(newArrayLength - arrayLength).to.equal(1)
          })
          it('Expects the last element of the array to be the element array', () => {
            const testArrayElement = get(testElementArray, `${deepProp}`).pop()
            expect(testArrayElement).to.be.an('array')
            expect(testArrayElement[0][Object.keys(propObj)[0]]).to.equal(propValue)
          })
        })
      })
    })
  })
  describe('get', () => {
    it('Expects to be a function', () => {
      expect(typeof get === 'function').to.be.true
    })
    it('Expects a TypeError when invoked with argument "object" that is not an Object', () => {
      try {
        get(null, 'deep.property.check')
      } catch (e) {
        expect(e instanceof TypeError).to.be.true
      }
    })
    it('Expects a TypeError when invoked with argument "assignment" that is not an String', () => {
      try {
        get(source, null, 'anything')
      } catch (e) {
        expect(e instanceof TypeError).to.be.true
      }
    })
    describe('Feature 1: existing properties', () => {
      describe('first layer properties', () => {
        it(`Expects existing first nested property "${firstLayerPropPrimitive}" to be the value "${_firstLayer}${capitalize(_primitive)}"`, () => {
          expect(get(source, firstLayerPropPrimitive)).to.equal(`${_firstLayer}${capitalize(_primitive)}`)
        })
        it(`Expects existing first nested property "${firstLayerPropArray}" to be an array`, () => {
          expect(get(source, firstLayerPropArray)).to.be.an('array')
        })
        it(`Expects existing first nested property "${firstLayerPropObject}" to be an object`, () => {
          expect(get(source, firstLayerPropObject)).to.be.an('object')
        })
        it(`Expects existing first nested property "${firstLayerPropObject}" to have the property "${_primitive}" with the value "${_firstLayer}Object${capitalize(_primitive)}"`, () => {
          expect(get(source, firstLayerPropObject)).to.have.property(_primitive)
          console.log('what is firstLayerPropObjectPropPrimitive', firstLayerPropObjectPropPrimitive)
          expect(get(source, firstLayerPropObjectPropPrimitive)).to.equal(`${_firstLayer}Object${capitalize(_primitive)}`)
        })
        it(`Expects existing first nested property "${firstLayerPropObjectPropArray}" to be an array`, () => {
          expect(get(source, firstLayerPropObjectPropArray)).to.be.an('array')
        })
        it(`Expects existing first nested property "${firstLayer}" to have the property "${_secondLayer}" that is an object`, () => {
          expect(get(source, firstLayer)).to.have.property(_secondLayer)
          expect(get(source, `${firstLayer}.${_secondLayer}`)).to.be.an('object')
        })
      })
      describe('second layer properties', () => {
        it(`Expects existing second nested property "${secondLayerPropPrimitive}" to be the value "${_secondLayer}${capitalize(_primitive)}"`, () => {
          expect(get(source, secondLayerPropPrimitive)).to.equal(`${_secondLayer}${capitalize(_primitive)}`)
        })
        it(`Expects existing second nested property "${secondLayerPropArray}" to be an array`, () => {
          expect(get(source, secondLayerPropArray)).to.be.an('array')
        })
        it(`Expects existing second nested property "${secondLayerPropObject}" to be an object`, () => {
          expect(get(source, secondLayerPropObject)).to.be.an('object')
        })
        it(`Expects existing second nested property "${secondLayerPropObject}" to have the property "${_primitive}" with the value "${_secondLayer}Object${capitalize(_primitive)}"`, () => {
          expect(get(source, secondLayerPropObject)).to.have.property(_primitive)
          expect(get(source, secondLayerPropObjectPropPrimitive)).to.equal(`${_secondLayer}Object${capitalize(_primitive)}`)
        })
        it(`Expects existing second nested property "${secondLayerPropObjectPropArray}" to be an array`, () => {
          expect(get(source, secondLayerPropObjectPropArray)).to.be.an('array')
        })
      })
    })
    describe(`Feature 2: non-existing properties `, () => {
      it('Expects undefined if the nested property value do not exist', () => {
        expect(get(source, 'does.not.exist.property')).to.be.an('undefined')
      })
      it('Expects undefined if nested property do not exist', () => {
        expect(get(source, 'does.not.exist.property')).to.be.an('undefined')
      })
    })
    describe(`Feature 3: special handling`, () => {
      describe(`Handles different object property notations such as the [,],", or ' characters `, () => {
        const notationsSecondLayerObject = `nested.firstLayer['secondLayer']["obj"]`
        it(`Expects "${notationsSecondLayerObject}" to be an object with the property "${_primitive}" value of ${_primitive}`, () => {
          expect(get(source, notationsSecondLayerObject)).to.be.an('object')
          expect(get(source, notationsSecondLayerObject)).to.have.property(_primitive, `${_secondLayer}Object${capitalize(_primitive)}`)
        })
        it(`Expects .dot notation using numbers to be handled`, () => {
          expect(get(source, secondLayerPropNumberAsKey)).to.equal('primitiveNumberAsKey')
        })
      })
    })
  })
})
