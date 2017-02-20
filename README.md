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