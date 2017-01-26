'use strict';

const path = require('path');
const { type} = require(path.join(__dirname, '..', './lib/index.js'));

console.log(type.is('string'))

// console.log(Object.keys(is('string')))