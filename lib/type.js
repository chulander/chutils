'use strict';
// basic types are
// 1. null
// 2. undefined
// 3. boolean
// 4. number
// 5. string
// 6. object
// 7. symbol -- added in ES6!
// ** All of these types except "object" are called "primitives"

/**
 * Handles Javascript's bug with null
 * @param val{[null | undefined | boolean | number | string | symbol | Object | Function | Array ]} - value to be evaluated
 * @returns {String} - return value in string format
 */
const is = function ( val ) {
  const valType = typeof val;
  return (!val && valType === 'object')
    ? 'null'
    : valType !== 'object'
      ? valType
      //https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
      : Object.prototype.toString.call(val).match(/\s([\w]+)/)[1].toLowerCase()
}

/**
 * Handles Javascript's bug with null
 * @param val{[null | undefined | boolean | number | string | symbol | Object | Function | Array ]} - value to be evaluated
 * @returns {String} - return value in string format
 */
const shouldBe = function ( val ) {
  const typeIs = is(val);
  if ( typeIs !== 'object' ){
    return typeIs;
  }
  else {
    if ( Array.isArray(val) ) return 'array'
  }

}
module.exports = {
  is,
  shouldBe
}
