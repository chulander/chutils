'use strict';

require('mocha');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const {safe:{assign, compare,get}} = require(path.resolve(__dirname, '../lib'));
const fs = require('fs');
const bluebird = require('bluebird');

describe('safe', function (){
  const source = {
    package: {
      name: 'chutils',
    },
    dependencies: {
      packageName: 'testPackage'
    },
    nested: {
      deep: {
        property: {
          value: 'test'
        }
      }
    }
  }

  describe('assign', () =>{
    it('Expects an function', () =>{
      expect(typeof assign === 'function').to.be.true;
    });
    it('Expects a TypeError when invoked with argument "assignment" that is not an string', () =>{
      try {
        assign(source, null, 'anything')
      }
      catch (e) {
        expect(e instanceof TypeError).to.be.true;
      }
    });
    it('Expects the nested property to be added', () =>{
      const deepProp = 'my.new.prop'
      const newObj = assign(source, deepProp, 'newProp');
      expect(newObj).to.have.deep.property(deepProp)
    })
    it('Expects the nested property to be added with the correct value', () =>{
      const deepProp = 'my.new.prop'
      const newObj = assign(source, deepProp, 'newProp');
      expect(newObj.my.new.prop).to.equal('newProp')
    })
  })
  describe('compare', () =>{
    it('Expects to be a function', () =>{
      expect(typeof compare === 'function').to.be.true;
    });
    it('Expects a TypeError when invoked with argument "object" that is not an Object', () =>{
      try {
        compare(null, 'deep.property.check', 'anything')
      }
      catch (e) {
        expect(e instanceof TypeError).to.be.true;
      }
    });
    it('Expects a TypeError when invoked with argument "assignment" that is not an String', () =>{
      try {
        compare(source, null, 'anything')
      }
      catch (e) {
        expect(e instanceof TypeError).to.be.true;
      }
    });
    it('Expects a TypeError when invoked with argument "val" that is not an primitive', () =>{
      try {
        compare(source, 'deep.property.check', {name: 'anything'})
      }
      catch (e) {
        expect(e instanceof TypeError).to.be.true;
      }
    });
    it('Expects true if the nested property value equals the expected value', () =>{
      expect(compare(source, 'nested.deep.property.value', 'test')).to.be.true
    })
    it(`Expects true if the nested property value equals the expected value even if the argument "assignment" contains [,],", or ' object property notations`, () =>{
      expect(compare(source, `nested['deep']["property"].value`, 'test')).to.be.true
    })
    it('Expects false if the nested property value does not equal the expected property value', () =>{
      expect(compare(source, 'nested.deep.property.value', 'falseyValue')).to.be.false
    })
    it('Expects false if any member of the intermediary nested properties does not exist', () =>{
      expect(compare(source, 'does.not.exist.property', 'test')).to.be.false
    })
  })
  describe('get', () =>{
    it('Expects to be a function', () =>{
      expect(typeof get === 'function').to.be.true;
    });
    it('Expects a TypeError when invoked with argument "object" that is not an Object', () =>{
      try {
        get(null, 'deep.property.check')
      }
      catch (e) {
        expect(e instanceof TypeError).to.be.true;
      }
    });
    it('Expects a TypeError when invoked with argument "assignment" that is not an String', () =>{
      try {
        get(source, null, 'anything')
      }
      catch (e) {
        expect(e instanceof TypeError).to.be.true;
      }
    });
    it('Expects the nested property value if it exists', () =>{
      expect(get(source, 'nested.deep.property.value')).to.equal('test');
    })
    it(`Expects the nested property value even if the argument "assignment" contains [,],", or ' object property notations`, () =>{
      expect(get(source, `nested['deep']["property"].value`)).equal('test');
    })
    it('Expects undefined if the nested property value does not exist', () =>{
      expect(get(source, 'does.not.exist.property')).to.be.an('undefined');
    })
    it('Expects undefined if any member of the intermediary nested properties does not exist', () =>{
      expect(get(source, 'does.not.exist.property')).to.be.an('undefined');
    })
  })
});
