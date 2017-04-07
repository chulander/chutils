'use strict'

const path = require('path')
const utility = require(path.join(__dirname, '../utility'))
const { baseConfig, baseObject } = utility.base
const { shouldBe } = require('./type')

module.exports = {
  shouldBe: baseConfig(Object.assign({}, baseObject(), {
    baseFunction: function (variables) {
      const { objectKeyValue, val } = variables
      return shouldBe(objectKeyValue) === val
    }
    // condition: function (variables) {
    //   const { val } = variables
    //   return (val && typeof val === 'object')
    //     ? new TypeError('val is typeof Object, compare only handles primitives')
    //     : undefined
    // }
  })),
  value: baseConfig(Object.assign({}, baseObject(), {
    baseFunction: function (variables) {
      const { objectKeyValue, val } = variables
      return objectKeyValue === val
    },
    condition: function (variables) {
      const { val } = variables
      return (val && typeof val === 'object')
        ? new TypeError('val is typeof Object, compare only handles primitives')
        : undefined
    }
  }))
}
