'use strict';

const path = require('path');
const { base:{ get, compare , assign} } = require(path.join(__dirname, '..', './lib/index.js'));


var source = {
  package: {
    name: 'chutils',
  },
  dependencies: {
    packageName: 'testPackage'
  },
  nested: {
    testArray: ['randomString', {name:'randomLastName'}, 1, 2, 3],
    deep: {
      property: {
        value: 'test'
      }
    },
    func: function(){return 'function test'}
  },

}

// assigns deeply nested properties even if intermediary properties do not exist
// var modifiedSource = assign(source, 'class.type.home', { year: 2017 })
// console.log('source', source)
// const newObj = assign(source, 'nested.deep', {value: 'bryan'});
// console.log('newobj', newObj.nested);
// const newObj2 = assign(source, 'nested.deep', {hello:'newBryan'});
const newObj2 = assign(source, 'nested.deep.property.test', 'newBryan');
// const newObj2 = assign(source, 'just.test', 'newBryan');
// const newObj2 = assign(source, 'just.test', {value:'newBryan'});

console.log('newObj2', newObj2)
// /*
//  modifiedSource { package: { name: 'chutils' },
//  dependencies: { packageName: 'testPackage' },
//  nested: { testArr: [ 'bryan', 1, 2, 3 ], deep: { property: {value: 'test'} } },
//  class: { type: { home: { year: 2017 } } } }
//  */
//
// // var modifiedSourceOnArrayProp = assign(source, 'nested.testArray.retest', { year: 2017 })
// // console.log('modifiedSourceOnArrayProp', modifiedSourceOnArrayProp.nested);
// /*
//  modifiedSourceOnArrayProp { package: { name: 'chutils' },
//  dependencies: { packageName: 'testPackage' },
//  nested: { testArr: [ 'bryan', 1, 2, 3 ], deep: { newProp: { year: 2017 } } } }
//
//  */
//
//
// // compares deeply-nested properties that do not exist
// var testCompareFalse = compare(source, 'does.not.exist.property', 'notAProp') // false
// console.log('testCompareFalse', testCompareFalse);
// // compares deeply-nested properties
// var testCompareTrue1 = compare(source, `nested.deep.property.value`, 'test'); // true
// console.log('testCompareTrue1', testCompareTrue1);
// // compares deeply-nested properties in different Object notations
// var testCompareTrue2 = compare(source, `nested['deep']["property"].value`, 'test'); // true
// console.log('testCompareTrue2', testCompareTrue2);
// // gets the deeply-nested property value
// var value1 = get(source, `nested.deep.property.value`); // test
// console.log('value1', value1);
// // gets the deeply-nested property value in different Object notations
// var value2 = get(source, `nested['deep'][property].value`); // test
// console.log('value2', value2);
// // gets the deeply-nested property value of undefined if deeply-nested property does not exists
// var value3 = get(source, `nested.deep.property.value.missing`); // undefined
// console.log('value3', value3);