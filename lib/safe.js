'use strict';
const path = require('path');
const utility = require(path.join(__dirname, '../utility'));

function assign ( obj, assignment, val ) {
  if ( !obj && typeof obj !== 'object' ){
    return new TypeError('obj argument is not type Object')
  }
  else if ( typeof assignment !== 'string' ){
    return new TypeError('assignment argument must be a string')
  }
  else {
    const props = utility.cleanDotNotation(assignment).split('.');
    const prop = props.shift();

    const valueIsObject = val && typeof val === 'object' && !Array.isArray(val);
    const propIsObject = obj[prop] && typeof obj[prop] === 'object' && !Array.isArray(obj[prop])
    const isFinalCall = props.length === 0;
    // console.log('isFinalCall', isFinalCall)
    // console.log('value is an object', valueIsObject)
    // if(!valueIsObject) {
    // console.log('what is value', val)
    // }

    // console.log(`obj[${prop}] is an object`, propIsObject)
    if ( isFinalCall && propIsObject && !valueIsObject ){
      throw new Error(`assigning primitive "${val}" to an existing object property "${prop}" will result in the lost of the existing key "${prop}"`)
    }

    return Object.assign({}, obj, {
      [prop]: (isFinalCall)
        // ? propIsObject && valueIsObject
        // ? Object.assign({}, obj[prop], val)
        // : propIsObject && !valueIsObject
        //   ? Object.assign({}, obj[prop], {[val]: val})
        //   : val
        ? val
        : Array.isArray(obj[prop])
          ? [...obj[prop], ...[assign({}, props.join('.'), val)]]
          : Object.assign({}, assign(obj[prop] || {}, props.join('.'), val))
    })
  }
}

function compare(compareEngine='default') {

  return function _compare( obj={}, assignment, val ) {
    if ( typeof assignment !== 'string' ){
      return new TypeError('assignment argument is not a string')
    }
    else if ( val && typeof val === 'object' ){
      return new TypeError('val is typeof Object, compare only handles primitives')
    }
    else {
      const props = utility.cleanDotNotation(assignment).split('.');
      const prop = props.shift();
      return (props.length === 0)
        ? compareEngine ==='default'
          ? obj[prop] === val
          : compareEngine(obj[prop]) === val
        : _compare(obj[prop] ? obj[prop] : {}, props.join('.'), val)
    }
  }
}
function get ( obj = {}, assignment ) {
  if ( typeof assignment !== 'string' ){
    return new TypeError('assignment argument is not a string')
  }
  else {
    const props = utility.cleanDotNotation(assignment).split('.');
    const prop = props.shift();
    return (props.length === 0)
      ? obj[prop]
      : get(obj[prop] ? obj[prop] : {}, props.join('.'))
  }
}

module.exports = {
  assign,
  compare,
  get,
}