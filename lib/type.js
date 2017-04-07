'use strict'
// basic types are
// 1. null
// 2. undefined
// 3. boolean
// 4. number
// 5. string
// 6. object
// 7. symbol -- added in ES6!
// ** All of these types except "object" are called "primitives"

const primitives = [
  'null',
  'undefined',
  'boolean',
  'string',
  'symbol'
]

/**
 * Handles Javascript's bug with null
 * @param val{[null | undefined | boolean | number | string | symbol | Object | Function | Array ] Promise} - value to be evaluated
 * @returns {String} - return value in string format
 */
const shouldBe = function (val) {
  const valType = typeof val
  if (valType === 'string') {
    try {
      const testIsJson = JSON.parse(val)
      return Object.keys(testIsJson).length
        ? 'json'
        : valType
    } catch (e) {
      return valType
    }
  }
  if (valType !== 'object') {
    return valType
  }

  // https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
  const returnValue = Object.prototype.toString.call(val).match(/\s([\w]+)/)[1].toLowerCase()
  // duck-typing promise thenable for non ES6 promisies such as Bluebird
  // return returnValue === 'object' && val.then
  //   ? 'promise'
  //   : returnValue
  if (returnValue === 'object' && val.then) {
    return 'promise'
  } else {
    return returnValue
  }
}

module.exports = {
  shouldBe: shouldBe,
  primitives: primitives
}
