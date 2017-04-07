# chutils
Ever find yourself feeling repetitive, a bit of the coding déjà blues? While your mind may be momentarily suffering from a relapse, your fingers don't have to with these utility function designed to win back some "me" time.
 
### Version
2.0.0

### Utility List (thus far)
#### type
1. shouldBe: get the "working" variable type (Thanks to [Angus](https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/)
)

```javascript
const { type: { shouldBe } } = require('chutils')

typeof null // "object"
shouldBe(null) // "null"

typeof [] // "object"
shouldBe([]) // "array"

typeof new Promise(success=>{},error=>{}) // "object"
shouldBe new Promise(success=>{},error=>{}) // "promise"
```

    

#### safe
1. assign: safely assign deeply-nested properties
```javascript
const { safe: { assign } } = require('chutils')

let obj = { package: 'chutils'}

obj = assign(obj, 'deeply.nested.layer', 'hi');

/*
obj = {
  package: 'chutils',
  deeply: {
    nested: {
      layer: 'hi' 
    }
  }
} 
*/
```
2. get: safely get deeply-nested properties
```javascript
const { safe: { get } } = require('chutils')

const obj = {
  package: 'chutils',
  deeply: {
    nested: {
      layer: 'hi' 
    }
  }
} 

get(obj,'deeply.nested.layer') // 'hi'

// even with different object notations
get(obj,'deeply["nested"].layer') // 'hi'

// no more TypeError accessing properties of undefined
obj.imaginary.layer // TypeError: Cannot read property 'imaginary' of undefined
get(obj,'imaginary.layer') // undefined
```
#### compare
1. value: safely compare deeply-nested property value (strict comparision)
```javascript
const { compare: { value } } = require('chutils')

const obj = {
  package: 'chutils',
  deeply: {
    nested: {
      layer: 'hi' 
    }
  }
} 

value(obj,'deeply.nested.layer','hi') // true

// even with different object notations
value(obj,'deeply["nested"].layer', 'hi') // true

// no more TypeError accessing properties of undefined
obj.imaginary.layer // TypeError: Cannot read property 'imaginary' of undefined
value(obj,'imaginary.layer', 'exist') // false
```

2. shouldBe: safely compare deeply-nested property value to it's type.shouldBe value
```javascript
const { compare: { shouldBe } } = require('chutils')

const obj = {
  package: 'chutils',
  deeply: {
    nested: {
      layer: 'hi',
      arr: [1,2,3]
    }
  },
  promiseObj: Promise.resolve()
} 

shouldBe(obj, 'deeply.nested["arr"]','array') // true
shouldBe(obj, 'promiseObj', 'promise') // true
```

#### async
1. dePromisify: unwraps an ES6 Promise to its nostalgic error-first callback form
```javascript
const { async: { dePromisify } } = require('chutils')
const bluebird = require('bluebird')

const fs = require('fs')
const readFileAsync = bluebird.promisify(fs.readFile)
const readFileCB = dePromisify(readFileAsync)
readFileCB('someText.txt', function(err,data){
  if(err) err
  else console.log(data) // some data here
})

````
2. dePromisifyAll: iterates through an object's enumerable properties and dePromisifies the functions
```javascript
const { async: { dePromisifyAll } } = require('chutils')
const bluebird = require('bluebird')

let fs = bluebird.promisifyAll(require('fs'))
fs = dePromisifyAll(fs)

fs.readFileCB('someText.txt', function(err,data){
  if(err) err
  else console.log(data) // some data here
})
```
3. promisify: wraps an error-first callback function into an ES6 Promise
```javascript
const { async: { promisify } } = require('chutils')
const fs = require('fs')

const readFileAsync = promisify(fs.readFile)
readFileAsync('someText.txt')
.then(data=>{
  console.log(data) // some data here
})

```
4. promisifyAll: iterates through an object's enumerable properties and promisifies the functions
```javascript
const { async: { promisifyAll } } = require('chutils')
const fs = promisifyAll(require('fs'))

fs.readFileAsync('someText.txt')
.then(data=>{
  console.log(data) // some data here
})

```

### Installation
Native ES6 Promises is required therefore Node v4.2.4+
```sh
$ npm i chutils
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