'use strict';

require('mocha');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const { safe:{ assign, compare, get } } = require(path.resolve(__dirname, '../lib'));
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
      testArray: ['randomString', { name: 'randomLastName' }, 1, 2, 3],
      deep: {
        property: {
          value: 'test'
        }
      }
    }
  }


  describe('assign', () => {
    const propValue = 'newProp';
    const propObj = { value: propValue };

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
          const newObj = assign(source, deepProp, { value: propValue });
          expect(newObj).to.have.deep.property(`${deepProp}.value`, propValue)
        })
      })
      describe('nested property exist', () => {
        describe('same property level', () => {
          describe('merging', () => {
            const deepProp = 'nested.deep.test';
            describe('primitives', () => {
              let newObj;
              before(() => {
                newObj = assign(source, deepProp, propValue);
              })
              it('Expects primitive values to be added', () => {
                expect(newObj.nested.deep.test).to.equal(propValue)
              })
              it('Expects nested property along the path to still exist', () => {
                expect(newObj).to.have.deep.property('nested.testArray[0]')
              })
              it('Expects nested property value along the path to still exist', () => {
                expect(newObj).to.have.deep.property('nested.testArray[1].name', 'randomLastName')
              })
            })
            describe('objects', () => {
              const newObj = assign(source, deepProp, propObj);
              it('Expects objects to be added', () => {
                expect(newObj).to.have.deep.property(`${deepProp}.value`, propValue)
              })
              it('Expects nested property along the path to still exist', () => {
                expect(newObj).to.have.deep.property('nested.deep.property.value')
              })
              it('Expects nested property value along the path to still exist', () => {
                expect(newObj).to.have.deep.property('nested.deep.property.value', 'test')
              })
            })
          })


        })
        describe('deeper property level', () => {
          const deepProp = 'nested.deep.property.deeperProperty';
          describe('objects', () => {
            let newObj;
            before(() => {
              newObj = assign(source, deepProp, propObj);
            })
            it('Expects object assignments to merge with existing properties', () => {
              expect(newObj.nested.deep.property.deeperProperty.value).to.equal(propValue)
            })
            it('Expects nested property along the path to still exist', () => {
              expect(newObj).to.have.deep.property('nested.deep.property')
            })
            it('Expects nested property value along the path to still exist', () => {
              expect(newObj).to.have.deep.property('nested.deep.property.value', 'test')
            })
          })
        })
      })
    })
    describe('edge cases', () => {
      describe('nested property do exist', () => {
        describe('overwriting', () => {
          describe('same property level', () => {
            const deepProp = 'nested.deep.property';
            it('Expects adding a primitive value to result in an error', () => {
              try {
                assign(source, deepProp, propValue);
              }
              catch ( e ) {
                expect(e instanceof Error).to.be.true;
              }
            })
            it('Expects adding a object to result in an error', () => {
              try {
                assign(source, deepProp, propObj);
              }
              catch ( e ) {
                expect(e instanceof Error).to.be.true;
              }
            })
          })
          describe('deeper property level', () => {
            const deepProp = 'nested.deep.property.deeperProperty';
            let newObj;
            before(() => {
              newObj = assign(source, deepProp, propObj);
            })
            it('Expects adding a primitive value to result in an error', () => {
              try {
                assign(source, deepProp, propValue);
              }
              catch ( e ) {
                expect(e instanceof Error).to.be.true;
              }
            })
            it('Expects object assignments to merge with existing properties', () => {
              expect(newObj.nested.deep.property.deeperProperty.value).to.equal(propValue)
            })
            it('Expects nested property along the path to still exist', () => {
              expect(newObj).to.have.deep.property('nested.deep.property')
            })
            it('Expects nested property value along the path to still exist', () => {
              expect(newObj).to.have.deep.property('nested.deep.property.value', 'test')
            })
          })
        })
      })
    })
    describe('opinionated cases', () => {
      describe('arrays', () => {
        const deepProp = 'nested.testArray.retest';
        const arrayLength = source.nested.testArray.length;
        describe('existing property is an array', () => {
          let newTestObj;
          let newTestPrimitive;
          before(()=>{
            newTestObj = assign(source, deepProp, propObj);
            newTestPrimitive = assign(source, deepProp, propValue);
          })
          it('Expects the array length to increase after nested object is assigned', () => {
            const newArrayLength = newTestObj.nested.testArray.length;
            expect(newArrayLength-arrayLength).to.equal(1);
          })
          it('Expects the last element of the array to be the correct object ', () => {
            const testArrayElement = newTestObj.nested.testArray.pop();
            expect(testArrayElement).to.have.deep.property(`retest.value`, propValue)
          })
          it('expects the array length to increase after nested primitive value is assigned', ()=>{
            const newArrayLength = newTestPrimitive.nested.testArray.length;
            expect(newArrayLength-arrayLength).to.equal(1);
          })
          it('Expects the last element of the array to be the correct primitive value ', () => {
            const testArrayElement = newTestPrimitive.nested.testArray.pop();
            expect(testArrayElement).to.have.deep.property(`retest`, propValue)
          })
        })
      })
    })
  })
  describe('compare', () => {
    it('Expects to be a function', () => {
      expect(typeof compare === 'function').to.be.true;
    });
    it('Expects a TypeError when invoked with argument "object" that is not an Object', () => {
      try {
        compare(null, 'deep.property.check', 'anything')
      }
      catch ( e ) {
        expect(e instanceof TypeError).to.be.true;
      }
    });
    it('Expects a TypeError when invoked with argument "assignment" that is not an String', () => {
      try {
        compare(source, null, 'anything')
      }
      catch ( e ) {
        expect(e instanceof TypeError).to.be.true;
      }
    });
    it('Expects a TypeError when invoked with argument "val" that is not an primitive', () => {
      try {
        compare(source, 'deep.property.check', { name: 'anything' })
      }
      catch ( e ) {
        expect(e instanceof TypeError).to.be.true;
      }
    });
    it('Expects true if the nested property value equals the expected value', () => {
      expect(compare(source, 'nested.deep.property.value', 'test')).to.be.true
    })
    it(`Expects true if the nested property value equals the expected value even if the argument "assignment" contains [,],", or ' object property notations`, () => {
      expect(compare(source, `nested['deep']["property"].value`, 'test')).to.be.true
    })
    it('Expects false if the nested property value do not equal the expected property value', () => {
      expect(compare(source, 'nested.deep.property.value', 'falseyValue')).to.be.false
    })
    it('Expects false if nested property do not exist', () => {
      expect(compare(source, 'does.not.exist.property', 'test')).to.be.false
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
    it('Expects the nested property value if it exists', () => {
      expect(get(source, 'nested.deep.property.value')).to.equal('test');
    })
    it('Expects the nested property to have its own property if it exists', () => {
      // expect(get(source, 'nested.deep.property')).to.have.deep.property('source.nested.deep.property.value','test');
      expect(get(source, 'nested.deep.property')).to.be.an('object');
      expect(get(source, 'nested.deep.property')).to.have.property('value');
      expect(get(source, 'nested.deep.property')['value']).equal('test');

    })
    it(`Expects the nested property value even if the argument "assignment" contains [,],", or ' object property notations`, () => {
      expect(get(source, `nested['deep']["property"].value`)).equal('test');
    })
    it('Expects undefined if the nested property value do not exist', () => {
      expect(get(source, 'does.not.exist.property')).to.be.an('undefined');
    })
    it('Expects undefined if nested property do not exist', () => {
      expect(get(source, 'does.not.exist.property')).to.be.an('undefined');
    })
  })
});
