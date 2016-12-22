# chutils
Ever find yourself feeling repetitive, a bit of the coding déjà blues? While your mind may be momentarily suffering from a relapse, your fingers don't have to with these utility function designed to win back some "me" time.
 
### Version
0.0.4

### Utilties
1. freeAssign: worry-free nested property assignment
2. de-promisify: unwraps an ES6 Promise to its nostalgic error-first callback form

### Installation
Native ES6 Promises is required therefore Node v4.2.4+
```sh
$ npm i chutils
```
### Usage
```javascript
const { safeAssign } = require('chutils');
var source = {
  package:{
    "name": "chutils",
  },
  dependencies:{
     "de-promisify": "^0.0.3",  
  }

}

var modifiedSource = safeAssign(source,'class.type.home',{year:2017})
console.log('what is modifiedSource', modifiedSource)
/* 
{ package: { 
    name: 'chutils' 
    },
    dependencies: { 
    'de-promisify': '^0.0.3' 
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
```
### Testing
```sh
$ npm i chutils
$ cd ./node_modules/chutils
$ npm i
$ npm test
```

License
----

MIT