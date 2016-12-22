'use strict';

require('mocha');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const {safe:{assign, compare}} = require(path.resolve(__dirname, '../lib'));
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
    it('Expect an function', () =>{
      expect(typeof assign === 'function').to.be.true;
    });
    it('Expect a TypeError when invoked with argument "assignment" that is not an string', () =>{
      try {
        assign(source, null, 'anything')
      }
      catch (e) {
        expect(e instanceof TypeError).to.be.true;
      }
    });
    it('Expect the nested property to be added', () =>{
      const deepProp = 'my.new.prop'
      const newObj = assign(source, deepProp, 'newProp');
      expect(newObj).to.have.deep.property(deepProp)
    })
    it('Expect the nested property to be added with the correct value', () =>{
      const deepProp = 'my.new.prop'
      const newObj = assign(source, deepProp, 'newProp');
      expect(newObj.my.new.prop).to.equal('newProp')
    })
  })
  describe('compare', () =>{
    it('Expect to be a function', () =>{
      expect(typeof compare === 'function').to.be.true;
    });
    it('Expect a TypeError when invoked with argument "object" that is not an Object', () =>{
      try {
        compare(null, 'deep.property.check', 'anything')
      }
      catch (e) {
        expect(e instanceof TypeError).to.be.true;
      }
    });
    it('Expect a TypeError when invoked with argument "assignment" that is not an String', () =>{
      try {
        compare(source, null, 'anything')
      }
      catch (e) {
        expect(e instanceof TypeError).to.be.true;
      }
    });
    it('Expect a TypeError when invoked with argument "val" that is not an primitive', () =>{
      try {
        compare(source, 'deep.property.check', {name: 'anything'})
      }
      catch (e) {
        expect(e instanceof TypeError).to.be.true;
      }
    });
    it('Expect true if the nested property value equals the expected value', () =>{
      expect(compare(source, 'nested.deep.property.value', 'test')).to.be.true
    })
    it(`Expect true if the nested property value equals the expected value even if the argument "assignment" contains [,],", or ' expressions for object property notations`, () =>{
      expect(compare(source, `nested['deep']["property"].value`, 'test')).to.be.true
    })
    it('Expect false if the nested property value does not equal the expected property value', () =>{
      expect(compare(source, 'nested.deep.property.value', 'falseyValue')).to.be.false
    })
    it('Expect false if the any member of the intermediary nested properties does not exist', () =>{
      expect(compare(source, 'does.not.exist.property', 'test')).to.be.false
    })
  })
});
