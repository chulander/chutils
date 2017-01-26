'use strict';

require('mocha');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const {
  safe:{
    assign,
    valueCompare,
    get,
    typeCompare,
  },
  type: {
    is
  }
} = require(path.resolve(__dirname, '../lib'));
const fs = require('fs');
const bluebird = require('bluebird');

describe('safe', function () {
  const source = {
    package: {
      name: 'chutils',
    },
    dependencies: {
      packageName: 'testPackage'
    },
    nested: {
      first_layer: {
        primitive: 'first_layer_primitive',
        arr: ['randomString', { name: 'randomLastName' }, 1, 2, 3],
        obj: {
          primitive: 'first_layer_object_primitive',
          arr: ['randomString', { name: 'randomLastName' }, 1, 2, 3],
        },
        second_layer: {
          primitive: 'second_layer_primitive',
          arr: ['randomString', { name: 'randomLastName' }, 1, 2, 3],
          obj: {
            primitive: 'second_layer_object_primitive',
            arr: ['randomString', { name: 'randomLastName' }, 1, 2, 3],
          },
          ['0']: 'primitive_number_as_key'
        },
      },
    }
  }
  const _root = 'nested';
  const _primitive = 'primitive';
  const _object = 'obj';
  const _array = 'arr';
  const _first_layer = 'first_layer';
  const _second_layer = 'second_layer';
  const createNestedProps = ( ...args ) => args.map(item => item).join('.')

  const first_layer_prop_primitive = createNestedProps(_root, _first_layer, _primitive);
  const first_layer_prop_array = createNestedProps(_root, _first_layer, _array);
  const first_layer_prop_object = createNestedProps(_root, _first_layer, _object);
  const first_layer_prop_object_prop_primitive = createNestedProps(_root, _first_layer, _object, _primitive);
  const first_layer_prop_object_prop_array = createNestedProps(_root, _first_layer, _object, _array);
  const first_layer = createNestedProps(_root, _first_layer);

  const second_layer_prop_primitive = createNestedProps(_root, _first_layer, _second_layer, _primitive);
  const second_layer_prop_array = createNestedProps(_root, _first_layer, _second_layer, _array);
  const second_layer_prop_object = createNestedProps(_root, _first_layer, _second_layer, _object);
  const second_layer_prop_object_prop_primitive = createNestedProps(_root, _first_layer, _second_layer, _object, _primitive);
  const second_layer_prop_object_prop_array = createNestedProps(_root, _first_layer, _second_layer, _object, _array);
  const second_layer_prop_number_as_key = createNestedProps(_root, _first_layer, _second_layer, '0');

  const propFirstLayer = createNestedProps(_root,_first_layer);
  const propSecondLayer = createNestedProps(_root,_first_layer,_second_layer);


  describe('assign', () => {
    const propValue = 'assignPropValue';
    const propObj = { primitive: propValue };
    describe('sanity checks', () => {
      it('Expects an function', () => {
        expect(typeof assign === 'function').to.be.true;
      });
      it('Expects a TypeError when invoked with argument "assignment" that is not an string', () => {
        try {
          assign(source, null, 'anything')
        }
        catch ( e ) {
          expect(e instanceof TypeError).to.be.true;
        }
      });
    })
    describe('obvious cases', () => {
      describe('nested property do not exist', () => {
        const deepProp = 'my.new.prop';
        it('Expects primitive values to be added', () => {
          const newObj = assign(source, deepProp, propValue);
          expect(newObj).to.have.deep.property(`${deepProp}`, propValue)
        })
        it('Expects objects to be added', () => {
          const newObj = assign(source, deepProp, propObj);
          expect(newObj).to.have.deep.property(`${deepProp}.${Object.keys(propObj)[0]}`, `${propObj[Object.keys(propObj)[0]]}`)
        })
        it('Expects array to be added', () => {
          const newObj = assign(source, deepProp, [propObj]);
          expect(newObj).to.have.deep.property(`${deepProp}[0].${Object.keys(propObj)[0]}`, `${propObj[Object.keys(propObj)[0]]}`)
        })
        it('Expects function to be added', () => {
          const newObj = assign(source, deepProp, function () {return propObj});
          const testFunc = get(newObj, deepProp);
          expect(testFunc).to.be.an('function')
          // expect(testFunc).to.be.an('object');
          // expect(testFunc).to.have.deep.property('primitive', propValue)
        })
      })
      describe('nested property exist', () => {
        describe('property level: first_layer', () => {
          const deepProp = `${propFirstLayer}.deepProp`;
          describe('primitives', () => {
            let newObj;
            before(() => {
              newObj = assign(source, deepProp, propValue);
            })
            it('Expects primitive values to be added', () => {
              expect(newObj.nested.first_layer.deepProp).to.equal(propValue)
            })
            it('Expects nested property along the path to still exist', () => {
              expect(newObj).to.have.deep.property('nested.first_layer.arr')
            })
            it('Expects nested property value along the path to still exist', () => {
              expect(newObj).to.have.deep.property('nested.first_layer.arr[1].name', 'randomLastName')
            })
          })
          describe('objects', () => {
            const newObj = assign(source, deepProp, propObj);
            it('Expects objects to be added', () => {
              expect(newObj).to.have.deep.property(`${deepProp}.primitive`, propValue)
            })
            it('Expects nested property along the path to still exist', () => {
              expect(newObj).to.have.deep.property('nested.first_layer.primitive')
            })
            it('Expects nested property value along the path to still exist', () => {
              expect(newObj).to.have.deep.property('nested.first_layer.primitive', 'first_layer_primitive')
            })
          })
        })
      })
    })
    describe('edge cases', () => {
      describe('nested property do exist', () => {
        describe('property level: first_layer', () => {
          it('Expects adding a primitive value to result in an error', () => {
            try {
              assign(source, propFirstLayer, propValue);
            }
            catch ( e ) {
              expect(e instanceof Error).to.be.true;
            }
          })
          it('Expects adding a object to result in an error', () => {
            try {
              assign(source, propFirstLayer, propObj);
            }
            catch ( e ) {
              expect(e instanceof Error).to.be.true;
            }
          })
          it('Expects adding a deep object to result in an error', () => {
            try {
              assign(source, propSecondLayer, propObj);
            }
            catch ( e ) {
              expect(e instanceof Error).to.be.true;
            }
          })
        })
        describe('property level: second_layer', () => {
          let newObj;
          const deepProp = `${propSecondLayer}.deepProp`;
          before(() => {
            newObj = assign(source, deepProp, propValue);
          })
          it('Expects adding a primitive value to result in an error', () => {
            try {
              assign(source, propSecondLayer, propValue);
            }
            catch ( e ) {
              expect(e instanceof Error).to.be.true;
            }
          })
          it('Expects object assignments to merge with existing properties', () => {
            expect(get(newObj, `${deepProp}`)).to.equal(propValue)
          })
          it('Expects nested property along the path to still exist', () => {
            expect(newObj).to.have.deep.property(`${propFirstLayer}.${Object.keys(propObj)[0]}`)
          })
          it('Expects nested property value along the path to still exist', () => {
            expect(newObj).to.have.deep.property(`${propSecondLayer}.${Object.keys(propObj)[0]}`, 'second_layer_primitive')
          })
        })
      })
    })
    describe('opinionated cases', () => {
      describe('arrays', () => {
        const deepProp = `${propFirstLayer}.arr`;
        const arrayLength = get(source, `${deepProp}`).length;
        describe('existing property is an array', () => {
          let testElementObj;
          let testElementPrimitive;
          let testElementArray;
          before(() => {
            testElementObj = assign(source, deepProp, propObj);
            testElementPrimitive = assign(source, deepProp, propValue);
            testElementArray = assign(source, deepProp,[propObj]);
          })
          it('Expects the array length to increase after element object is assigned', () => {
            const newArrayLength = get(testElementObj, `${deepProp}`).length;
            expect(newArrayLength - arrayLength).to.equal(1);
          })
          it('Expects the last element of the array to be the correct object ', () => {
            const testArrayElement = get(testElementObj, `${deepProp}`).pop();
            expect(testArrayElement).to.be.an('object');
            expect(testArrayElement).to.have.deep.property(`${Object.keys(propObj)[0]}`, propValue)
          })
          it('expects the array length to increase after element primitive value is assigned', () => {
            const newArrayLength = get(testElementPrimitive, `${deepProp}`).length;;
            expect(newArrayLength - arrayLength).to.equal(1);
          })
          it('Expects the last element of the array to be the correct primitive value ', () => {
            const testArrayElement = get(testElementPrimitive, `${deepProp}`).pop();
            expect(testArrayElement).to.be.an('string');
            expect(testArrayElement).to.equal(propValue)
          })
          it('expects the array length to increase after element array is assigned', () => {
            const newArrayLength = get(testElementArray, `${deepProp}`).length;;
            expect(newArrayLength - arrayLength).to.equal(1);
          })
          it('Expects the last element of the array to be the element array', () => {
            const testArrayElement = get(testElementArray, `${deepProp}`).pop();
            expect(testArrayElement).to.be.an('array');
            expect(testArrayElement[0][Object.keys(propObj)[0]]).to.equal(propValue)
          })
        })
      })
    })
  })
  describe('valueCompare', () => {
    it('Expects to be a function', () => {
      expect(typeof valueCompare === 'function').to.be.true;
    });
    it('Expects a TypeError when invoked with argument "object" that is not an Object', () => {
      try {
        valueCompare(null, 'deep.property.check', 'anything')
      }
      catch ( e ) {
        expect(e instanceof TypeError).to.be.true;
      }
    });
    it('Expects a TypeError when invoked with argument "assignment" that is not an String', () => {
      try {
        valueCompare(source, null, 'anything')
      }
      catch ( e ) {
        expect(e instanceof TypeError).to.be.true;
      }
    });
    it('Expects a TypeError when invoked with argument "val" that is not an primitive', () => {
      try {
        valueCompare(source, 'deep.property.check', { name: 'anything' })
      }
      catch ( e ) {
        expect(e instanceof TypeError).to.be.true;
      }
    });
    it('Expects true if the nested property value equals the expected value', () => {
      expect(valueCompare(source, 'nested.first_layer.second_layer.primitive', 'second_layer_primitive')).to.be.true
    })
    it(`Expects true if the nested property value equals the expected value even if the argument "assignment" contains [,],", or ' object property notations`, () => {
      expect(valueCompare(source, `nested['first_layer']["second_layer"].primitive`, 'second_layer_primitive')).to.be.true
    })
    it('Expects false if the nested property value do not equal the expected property value', () => {
      expect(valueCompare(source, 'nested.deep.property.value', 'falseyValue')).to.be.false
    })
    it('Expects false if nested property do not exist', () => {
      expect(valueCompare(source, 'does.not.exist.property', 'test')).to.be.false
    })
  })
  describe('typeCompare', () => {

    it('Expects type to be a "string"', () => {
      expect(typeCompare(source, `${propFirstLayer}.primitive`, 'string')).to.be.true;
    })
    it('Expects type to be a "null"', () => {
      const deepProp = `${propFirstLayer}.typeCompareNull`;
      const testObj = assign(source, deepProp, null);
      expect(typeCompare(testObj, deepProp, 'null')).to.be.true;
    })

  })
  describe('get', () => {

    it('Expects to be a function', () => {
      expect(typeof get === 'function').to.be.true;
    });
    it('Expects a TypeError when invoked with argument "object" that is not an Object', () => {
      try {
        get(null, 'deep.property.check')
      }
      catch ( e ) {
        expect(e instanceof TypeError).to.be.true;
      }
    });
    it('Expects a TypeError when invoked with argument "assignment" that is not an String', () => {
      try {
        get(source, null, 'anything')
      }
      catch ( e ) {
        expect(e instanceof TypeError).to.be.true;
      }
    });
    describe('Feature 1: existing properties', () => {
      describe('first layer properties', () => {
        it(`Expects existing first nested property "${first_layer_prop_primitive}" to be the value "${_first_layer}_${_primitive}"`, () => {
          expect(get(source, first_layer_prop_primitive)).to.equal(`${_first_layer}_${_primitive}`);
        })
        it(`Expects existing first nested property "${first_layer_prop_array}" to be an array`, () => {
          expect(get(source, first_layer_prop_array)).to.be.an('array');
        })
        it(`Expects existing first nested property "${first_layer_prop_object}" to be an object`, () => {
          expect(get(source, first_layer_prop_object)).to.be.an('object');
        })
        it(`Expects existing first nested property "${first_layer_prop_object}" to have the property "${_primitive}" with the value "${_first_layer}_object_${_primitive}"`, () => {
          expect(get(source, first_layer_prop_object)).to.have.property(_primitive);
          expect(get(source, first_layer_prop_object_prop_primitive)).to.equal(`${_first_layer}_object_${_primitive}`);
        })
        it(`Expects existing first nested property "${first_layer_prop_object_prop_array}" to be an array`, () => {
          expect(get(source, first_layer_prop_object_prop_array)).to.be.an('array');
        })
        it(`Expects existing first nested property "${first_layer}" to have the property "${_second_layer}" that is an object`, () => {
          expect(get(source, first_layer)).to.have.property(_second_layer);
          expect(get(source, `${first_layer}.${_second_layer}`)).to.be.an('object');
        })
      })
      describe('second layer properties', () => {
        it(`Expects existing second nested property "${second_layer_prop_primitive}" to be the value "${_second_layer}_${_primitive}"`, () => {
          expect(get(source, second_layer_prop_primitive)).to.equal(`${_second_layer}_${_primitive}`);
        })
        it(`Expects existing second nested property "${second_layer_prop_array}" to be an array`, () => {
          expect(get(source, second_layer_prop_array)).to.be.an('array');
        })
        it(`Expects existing second nested property "${second_layer_prop_object}" to be an object`, () => {
          expect(get(source, second_layer_prop_object)).to.be.an('object');
        })
        it(`Expects existing second nested property "${second_layer_prop_object}" to have the property "${_primitive}" with the value "${_second_layer}_object_${_primitive}"`, () => {
          expect(get(source, second_layer_prop_object)).to.have.property(_primitive);
          expect(get(source, second_layer_prop_object_prop_primitive)).to.equal(`${_second_layer}_object_${_primitive}`);
        })
        it(`Expects existing second nested property "${second_layer_prop_object_prop_array}" to be an array`, () => {
          expect(get(source, second_layer_prop_object_prop_array)).to.be.an('array');
        })
      })
    })
    describe(`Feature 2: non-existing properties `, () => {
      it('Expects undefined if the nested property value do not exist', () => {
        expect(get(source, 'does.not.exist.property')).to.be.an('undefined');
      })
      it('Expects undefined if nested property do not exist', () => {
        expect(get(source, 'does.not.exist.property')).to.be.an('undefined');
      })
    })
    describe(`Feature 3: special handling`, () => {
      describe(`Handles different object property notations such as the [,],", or ' characters `, () => {
        const notations_second_layer_object = `nested.first_layer['second_layer']["obj"]`
        it(`Expects "${notations_second_layer_object}" to be an object with the property "${_primitive}" value of ${_primitive}`, () => {
          expect(get(source, notations_second_layer_object)).to.be.an('object');
          expect(get(source, notations_second_layer_object)).to.have.property(_primitive, `${_second_layer}_object_${_primitive}`);
        })
        it(`Expects .dot notation using numbers to be handled`, () => {
          expect(get(source, second_layer_prop_number_as_key)).to.equal('primitive_number_as_key')
        })
      })
    })
  })
})
