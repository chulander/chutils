'use strict';
const fs = require('fs');
const path = require('path');

const {de:{promisify:de_promisify}} = require(path.join(__dirname, '..', './lib/index.js'));

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