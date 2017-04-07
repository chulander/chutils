'use strict'
const type = require('./type')

function dePromisify (fn) {
  if (!fn || typeof fn !== 'function') throw new TypeError('Error: (Type) - de_promisify must be called with a function')
  return function (...args) {
    const originalArgs = args.slice(0)
    const cb = args.pop()
    const isFunction = (typeof cb === 'function')
    if (!isFunction) {
      // console.info('last argument is not a callback function, calling original arguments')
      try {
        return fn(...originalArgs)
      } catch (e) {
        console.error(e.stack)
      }
    } else {
      Promise
      .resolve(fn)
      .then(trustedFn => trustedFn(...args))
      .then(data => cb(null, data))
      .catch(err => cb(err))
    }
  }
}

function promisify (fn, _this) {
  if (typeof fn !== 'function' && type.shouldBe(fn) !== 'promise') {
    throw new TypeError('Error: (Type) - promisify must be called with a function')
  }
  const _promisified = function () {
    const args = [...arguments]
    return new Promise((resolve, reject) => {
      args.push(function (err, data) {
        err ? reject(err) : resolve(data)
      })
      fn.apply(null, args)
    })
  }

  // if it's already a promise, just return it
  return type.shouldBe(fn) === 'promise'
    ? fn
    : _this
      ? _promisified.bind(_this)
      : _promisified
}
function promisifyAll (target, options = {suffix: 'Async'}, _this) {
  if (type.shouldBe(target) === 'object') {
    // Object.keys iterates through its own enumerable properties
    return Object.keys(target).reduce((current, next) => {
      const objectValue = current[next]
      if (type.shouldBe(objectValue) === 'function' && next.substr(next.length - options.suffix.length) !== options.suffix) {
        // ignores options.suffix function names
        // in this case, "Async"
        current[`${next}${options.suffix}`] = _this ? promisify(objectValue).bind(_this) : promisify(objectValue)
      }
      return current
    }, target)
  } else {
    throw new TypeError('Error: promisifyAll must be called with an object')
  }
}

function dePromisifyAll (target, options = {suffix: 'CB', targetSuffix: 'Async'}) {
  if (type.shouldBe(target) === 'object') {
    // Object.keys iterates through its own enumerable properties
    return Object.keys(target).reduce((current, next) => {
      const objectValue = current[next]
      if (type.shouldBe(objectValue) === 'function' && next.substr(next.length - options.targetSuffix.length) === options.targetSuffix) {
        const suffixLessKey = next.substr(0, next.length - options.targetSuffix.length)
        console.log('what is key', next)
        console.log('what is suffixLessKey', suffixLessKey)
        current[`${suffixLessKey}${options.suffix}`] = dePromisify(objectValue)
      }
      return current
    }, target)
  } else {
    throw new TypeError('Error: promisifyAll must be called with an object')
  }
}

module.exports = {
  promisify,
  promisifyAll,
  dePromisify,
  dePromisifyAll
}
