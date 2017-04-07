'use strict'
const cleanDotNotation = (str) => str.replace(/\[|]/g, '.').replace(/\.{2}/g, '.').replace(/'|"|\.$/g, '')

module.exports = {
  cleanDotNotation
}
