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
  var source = {
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


  // describe('assign', () => {
  //   const propValue = 'newProp';
  //   const propObj = { primitive: propValue };
  //
  //   describe('sanity checks', () => {
  //     it('Expects an function', () => {
  //       expect(typeof assign === 'function').to.be.true;
  //     });
  //     it('Expects a TypeError when invoked with argument "assignment" that is not an string', () => {
  //       try {
  //         assign(source, null, 'anything')
  //       }
  //       catch ( e ) {
  //         expect(e instanceof TypeError).to.be.true;
  //       }
  //     });
  //   })
  //   describe('obvious cases', () => {
  //     describe('nested property do not exist', () => {
  //       const deepProp = 'my.new.prop';
  //       it('Expects primitive values to be added', () => {
  //         const newObj = assign(source, deepProp, propValue);
  //         expect(newObj).to.have.deep.property(`${deepProp}`, propValue)
  //       })
  //       it('Expects objects to be added', () => {
  //         const newObj = assign(source, deepProp, { primitive: propValue });
  //         expect(newObj).to.have.deep.property(`${deepProp}.value`, propValue)
  //       })
  //     })
  //     describe('nested property exist', () => {
  //       describe('same property level', () => {
  //         describe('merging', () => {
  //           const deepProp = 'nested.deep.test';
  //           describe('primitives', () => {
  //             let newObj;
  //             before(() => {
  //               newObj = assign(source, deepProp, propValue);
  //             })
  //             it('Expects primitive values to be added', () => {
  //               expect(newObj.nested.deep.test).to.equal(propValue)
  //             })
  //             it('Expects nested property along the path to still exist', () => {
  //               console.log('what is newObj', newObj);
  //               expect(newObj).to.have.deep.property('nested.testArray[0]')
  //             })
  //             it('Expects nested property value along the path to still exist', () => {
  //               expect(newObj).to.have.deep.property('nested.testArray[1].name', 'randomLastName')
  //             })
  //           })
  //           describe('objects', () => {
  //             const newObj = assign(source, deepProp, propObj);
  //             it('Expects objects to be added', () => {
  //               expect(newObj).to.have.deep.property(`${deepProp}.value`, propValue)
  //             })
  //             it('Expects nested property along the path to still exist', () => {
  //               expect(newObj).to.have.deep.property('nested.deep.property.value')
  //             })
  //             it('Expects nested property value along the path to still exist', () => {
  //               expect(newObj).to.have.deep.property('nested.deep.property.value', 'test')
  //             })
  //           })
  //         })
  //
  //
  //       })
  //       describe('deeper property level', () => {
  //         const deepProp = 'nested.deep.property.deeperProperty';
  //         describe('objects', () => {
  //           let newObj;
  //           before(() => {
  //             newObj = assign(source, deepProp, propObj);
  //           })
  //           it('Expects object assignments to merge with existing properties', () => {
  //             expect(newObj.nested.deep.property.deeperProperty.value).to.equal(propValue)
  //           })
  //           it('Expects nested property along the path to still exist', () => {
  //             expect(newObj).to.have.deep.property('nested.deep.property')
  //           })
  //           it('Expects nested property value along the path to still exist', () => {
  //             expect(newObj).to.have.deep.property('nested.deep.property.value', 'test')
  //           })
  //         })
  //       })
  //     })
  //   })
  //   describe('edge cases', () => {
  //     describe('nested property do exist', () => {
  //       describe('overwriting', () => {
  //         describe('same property level', () => {
  //           const deepProp = 'nested.deep.property';
  //           it('Expects adding a primitive value to result in an error', () => {
  //             try {
  //               assign(source, deepProp, propValue);
  //             }
  //             catch ( e ) {
  //               expect(e instanceof Error).to.be.true;
  //             }
  //           })
  //           it('Expects adding a object to result in an error', () => {
  //             try {
  //               assign(source, deepProp, propObj);
  //             }
  //             catch ( e ) {
  //               expect(e instanceof Error).to.be.true;
  //             }
  //           })
  //         })
  //         describe('deeper property level', () => {
  //           const deepProp = 'nested.deep.property.deeperProperty';
  //           let newObj;
  //           before(() => {
  //             newObj = assign(source, deepProp, propObj);
  //           })
  //           it('Expects adding a primitive value to result in an error', () => {
  //             try {
  //               assign(source, deepProp, propValue);
  //             }
  //             catch ( e ) {
  //               expect(e instanceof Error).to.be.true;
  //             }
  //           })
  //           it('Expects object assignments to merge with existing properties', () => {
  //             expect(newObj.nested.deep.property.deeperProperty.value).to.equal(propValue)
  //           })
  //           it('Expects nested property along the path to still exist', () => {
  //             expect(newObj).to.have.deep.property('nested.deep.property')
  //           })
  //           it('Expects nested property value along the path to still exist', () => {
  //             expect(newObj).to.have.deep.property('nested.deep.property.value', 'test')
  //           })
  //         })
  //       })
  //     })
  //   })
  //   describe('opinionated cases', () => {
  //     describe('arrays', () => {
  //       const deepProp = 'nested.testArray.retest';
  //       const arrayLength = source.nested.testArray.length;
  //       describe('existing property is an array', () => {
  //         let newTestObj;
  //         let newTestPrimitive;
  //         before(() => {
  //           newTestObj = assign(source, deepProp, propObj);
  //           newTestPrimitive = assign(source, deepProp, propValue);
  //         })
  //         it('Expects the array length to increase after nested object is assigned', () => {
  //           const newArrayLength = newTestObj.nested.testArray.length;
  //           expect(newArrayLength - arrayLength).to.equal(1);
  //         })
  //         it('Expects the last element of the array to be the correct object ', () => {
  //           const testArrayElement = newTestObj.nested.testArray.pop();
  //           expect(testArrayElement).to.have.deep.property(`retest.value`, propValue)
  //         })
  //         it('expects the array length to increase after nested primitive value is assigned', () => {
  //           const newArrayLength = newTestPrimitive.nested.testArray.length;
  //           expect(newArrayLength - arrayLength).to.equal(1);
  //         })
  //         it('Expects the last element of the array to be the correct primitive value ', () => {
  //           const testArrayElement = newTestPrimitive.nested.testArray.pop();
  //           expect(testArrayElement).to.have.deep.property(`retest`, propValue)
  //         })
  //       })
  //     })
  //   })
  // })
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
      expect(valueCompare(source, 'nested.deep.property.value', 'test')).to.be.true
    })
    it(`Expects true if the nested property value equals the expected value even if the argument "assignment" contains [,],", or ' object property notations`, () => {
      expect(valueCompare(source, `nested['deep']["property"].value`, 'test')).to.be.true
    })
    it('Expects false if the nested property value do not equal the expected property value', () => {
      expect(valueCompare(source, 'nested.deep.property.value', 'falseyValue')).to.be.false
    })
    it('Expects false if nested property do not exist', () => {
      expect(valueCompare(source, 'does.not.exist.property', 'test')).to.be.false
    })
  })
  // describe('typeCompare', () => {
  //
  //   it('Expects type to be a "string"', () => {
  //     const testObj = assign(source, 'nested.deep.property.value', 'test');
  //     expect(typeCompare(testObj, 'nested.deep.property.value', 'string')).to.be.true;
  //   })
  //   it('Expects type to be a "null"', () => {
  //     const testObj = assign(source, 'nested.deep.property.value', null);
  //     expect(typeCompare(testObj, 'nested.deep.property.value', 'null')).to.be.true;
  //   })
  //
  // })
  describe('get', () => {
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
          expect(get(source, notations_second_layer_object)).to.have.property(_primitive,`${_second_layer}_object_${_primitive}`);
        })
        it(`Expects .dot notation using numbers to be handled`,()=>{
          console.log('what is second_layer_prop_number_as_key', second_layer_prop_number_as_key)
          expect(get(source, second_layer_prop_number_as_key)).to.equal('primitive_number_as_key')
        })
      })
    })
  })
})
