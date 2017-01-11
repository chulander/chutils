'use strict';
const path = require('path');
const utility = require(path.join(__dirname,'../utility'));

function assign(obj, assignment, val){

  if (typeof assignment !=='string'){
    return new TypeError('assignment parameter must be a string')
  } else {
    const props = utility.cleanDotNotation(assignment).split('.');
    const prop=props.shift();
    return Object.assign({}, obj, {
      [prop]: (props.length===0)
        ? val
        :  Object.assign({},obj[prop], assign({}, props.join('.'), val))
    })
  }
}

function compare(obj, assignment, val){
  if(!obj && typeof obj !=='object'){
    return new TypeError('obj parameter is not type Object, this function is used to compare nested properties')
  } else if (typeof assignment !=='string'){
    return new TypeError('assignment parameter is not a string')
  } else if(typeof val ==='object'){
    return new TypeError('val parameter is type Object  comparision can only be done on primitives')
  } else {
    const props = utility.cleanDotNotation(assignment).split('.');
    const prop=props.shift();
    return (props.length===0)
      ? obj[prop] === val ? true : false
      : compare(obj[prop] ? obj[prop] : {} , props.join('.'), val)
  }
}

function get(obj,assignment){
  if(!obj && typeof obj !=='object'){
    return new TypeError('obj parameter is not type Object, this function is used to compare nested properties')
  } else if (typeof assignment !=='string'){
    return new TypeError('assignment parameter is not a string')
  } else {
    const props = utility.cleanDotNotation(assignment).split('.');
    const prop=props.shift();
    return (props.length===0)
      ? obj[prop]
      : get(obj[prop] ? obj[prop] : {} , props.join('.'))
  }
}

module.exports = {
  assign,
  compare,
  get
}