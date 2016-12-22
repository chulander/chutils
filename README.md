# chutils
Ever find yourself feeling repetitive, a bit of the coding déjà blues? While your mind may be momentarily suffering from a relapse, your fingers don't have to with these utility function designed to win back some "me" time.
 
### Version
0.1.1

### Utility List (thus far)
1. safe.assign: safely assign deeply-nested properties even if the intermediary properties do noe exist
2. safe.compare: safely compare deeply-nested properties even if the intermediary properties do not exist
3. de.promisify: unwraps an ES6 Promise to its nostalgic error-first callback form

### Installation
Native ES6 Promises is required therefore Node v4.2.4+
```sh
$ npm i chutils
```
### Usage: safeAssign & safeCompare
```javascript
const {safe:{assign, compare, get}} = require('chutils');

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

// gets the deeply-nested property value
var value1 = get(source, `nested.deep.property.value`); // test

// gets the deeply-nested property value in different Object notations
var value2 = get(source, `nested['deep']["property"].value`); // test

```

### Usage: dePromisify
```javascript
const {de:{promisify:de_promisify}} = require('chutils')

const fs = require('fs');
const path = require('path');
const bluebird = require('bluebird');
const readFileAsync = bluebird.promisify(fs.readFile);
const testAsync = de_promisify(readFileAsync);

testAsync(path.resolve(__dirname, './sample.txt'), 'utf8', function (err, data){
    if(err) {
      //do something with this error
      console.log(`error is: ${err}`);
    }
    else {
      //do something on success
      console.log(`success: ${data}`);
    }
});
```


### Testing
```sh
$ npm i chutils
$ cd ./node_modules/chutils
$ npm i
$ npm run test
```

License
----

MIT