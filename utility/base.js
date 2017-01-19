'use strict';
const path = require('path');
const helper = require(path.join(__dirname, './helper'));

const baseConfig = function ( config ) {
  return function baseEngine ( obj = {}, assignment, val ) {
    const variables = config.variables(obj, assignment, val);
    const inputError = config.inputValidation(obj, assignment, val);
    const modelError = ( config.condition ) ? config.condition(variables) : undefined;

    const { props, prop } = variables
    return (inputError || modelError)
      ? inputError || modelError
      : config.stopIterate(props)
        ? config.baseFunction ? config.baseFunction(variables) : config.defaultBaseFunction(variables)
        : !config.iterateFunction
          ? baseEngine.call(null, obj[prop], props.join('.'), val)
          : config.iterateFunction.call(baseEngine, variables)
  }
}


const baseObject = function () {
  return {
    variables: function ( obj, assignment, val ) {
      const valueIsObject = val && typeof val === 'object' && !Array.isArray(val);
      const props = helper.cleanDotNotation(assignment).split('.')
      const prop = props.shift();
      const propIsObject = obj[prop] && typeof obj[prop] === 'object' && !Array.isArray(obj[prop])
      const isFinalCall = props.length === 0;
      const objectKeyValue = obj[prop];
      return {
        valueIsObject,
        propIsObject,
        isFinalCall,
        prop,
        props,
        objectKeyValue,
        val,
        obj
      }
    },
    stopIterate: function stopIterate ( props ) { return props.length === 0},
    inputValidation: function inputCheck ( obj, assignment, val ) {
      return ( typeof assignment !== 'string' )
        ? new TypeError(`${assignment} is not a string`)
        : undefined;
    },
    defaultBaseFunction: function ( variables ) {
      const { obj, prop } = variables
      return obj[prop]
    }
  }
}
module.exports = {
  baseConfig,
  baseObject,
}