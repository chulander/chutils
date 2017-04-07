# chutils
Ever find yourself feeling repetitive, a bit of the coding déjà blues? While your mind may be momentarily suffering from a relapse, your fingers don't have to with these utility function designed to win back some "me" time.
 
### Version
1.0.0

### Utility List (thus far)
1. safe.assign: safely assign deeply-nested properties
2. safe.get: safely get deeply-nested property values
3. safe.valueCompare: safely compare deeply-nested properties
4. safe.typeCompare: safely compare deeply-nested properties' data types and/or subtypes 
5. type.is: get the "working" typeof a variable which really means null returns "null", [] returns "array", /hello/i returns "regexp". Thanks to [Angus](https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/)
6. async.de_promisify: unwraps an ES6 Promise to its nostalgic error-first callback form
7. async.promisify: wraps an error-first callback function into an ES6 Promise

### Installation
Native ES6 Promises is required therefore Node v4.2.4+
```sh
$ npm i chutils
```
### Usage: (safe) assign, compare, and get
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

### Usage: (type) is
```javascript
const {type:{ is }} = require('chutils')


console.log(typeof null) // "object"
console.log(is(null)) // "null"

console.log(typeof [1,2,3]) // "object"
console.log(is[1,2,3]) // "array"

```

### Usage: (async) de_promisify
```javascript
const {async:{de_promisify}} = require('chutils')

const path = require('path');
const bluebird = require('bluebird');
const readFileAsync = bluebird.promisify(fs.readFile);
const testAsync = de_promisify(readFileAsync);
const testFile = path.resolve(__dirname, '../test/sample.txt');
const testErrorFile =path.resolve(__dirname, '../test/doesNotExist.txt');

// Successful File Read

// Promise Version
readFileAsync(testFile)
.then(file=>{
  console.log('promise success: file contexts are - ', file.toString());
})
.catch(err=>{
  console.log('promise error: error is - ', err);
})

// Callback Version
testAsync(testFile, function (err, file){
  if(err) {
    //do something with this error
    console.log('callback error: error is - ', err);
  }
  else {
    //do something on success
    console.log('callback success: file contexts are - ', file.toString());
  }
});

// Error File Read

// Promise Version
readFileAsync(testErrorFile)
.then(file=>{
  console.log('promise success: file contexts are - ', file)
})
.catch(err=>{
  console.log('promise error: error is - ', err);
})

// Callback Version
testAsync(testErrorFile, function (err, file){
  if(err) {
    //do something with this error
    console.log('callback error: error is - ', err);
  }
  else {
    //do something on success
    console.log('callback success: file contexts are - ', file.toString())
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