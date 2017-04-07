'use strict'

const path = require('path')
const utility = require(path.join(__dirname, '../utility'))
const {baseConfig, baseObject} = utility.base

module.exports = {
  get: baseConfig(Object.assign({}, baseObject())),
  assign: baseConfig(Object.assign({}, baseObject(), {
    baseFunction: function (variables) {
      const {prop, obj, val} = variables
      return Array.isArray(obj[prop])
        ? Object.assign({}, obj, {[prop]: [...obj[prop], val]})
        : Object.assign({}, obj, {[prop]: val})
    },
    iterateFunction: function iterateFunction (variables) {
      const {obj, prop, props, val} = variables

      return Object.assign({}, obj, {
        [prop]: Array.isArray(obj)
          ? [...obj[prop], ...[this({}, props.join('.'), val)]]
          : Object.assign({}, this(obj[prop] || {}, props.join('.'), val))
      })
    },
    condition: function (variables) {
      const {isFinalCall, propIsObject, valueIsObject, val, prop} = variables
      return (isFinalCall && propIsObject && !valueIsObject)
        ? new Error(`assigning primitive "${val}" to an existing object property "${prop}" will overwrite the existing property "${prop}"`)
        : undefined
    }
  }))
}
