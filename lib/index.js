'use strict'

const async = require('./async')
const safe = require('./safe')
const type = require('./type')
const compare = require('./compare')

module.exports = {
  async: async,
  compare: compare,
  safe: safe,
  type: type

}
