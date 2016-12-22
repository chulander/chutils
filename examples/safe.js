const {safe:{assign, compare}} = require('../lib');

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

// assigns deeply nested properties even if intermediary properties do not exist
var modifiedSource = assign(source, 'class.type.home', {year: 2017})

/*
 {
  package: {
    name: 'chutils'
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
  },
  class: {
    type: {
      home: {
        year: 2017
      }
    }
  }
}
*/

// compares deeply-nested properties that do not exist
var testCompareFalse = compare(source, 'does.not.exist.property', 'notAProp') // false

// compares deeply-nested properties
var testCompareTrue1 = compare(source, `nested.deep.property.value`, 'test'); // true

// compares deeply-nested properties in different Object notations
var testCompareTrue2 = compare(source, `nested['deep']["property"].value`, 'test'); // true