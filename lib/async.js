'use strict';
const de_promisify = function ( fn ) {
  if ( !fn || typeof fn !== 'function' ) throw new TypeError('Error: (Type) - de_promisify must be called with a function');
  return function ( ...args ) {
    const originalArgs = args.slice(0);
    const cb = args.pop();
    const isFunction = (typeof cb === 'function');
    if ( !isFunction ){
      console.info('last argument is not a callback function, calling original arguments')
      try {
        return fn(...originalArgs);
      } catch ( e ) {
        console.error(e.stack);
      }
    }
    else {
      Promise
      .resolve(fn)
      .then(trustedFn => trustedFn(...args))
      .then(data => cb(null, data))
      .catch(err => cb(err));
    }
  }
};

const promisify = function ( fn, _this ) {
  if ( typeof fn !== 'function' ){
    throw new TypeError('Error: (Type) - promisify must be called with a function')
  }
  const promisified = function () {
    const args = [...arguments];
    return new Promise(( resolve, reject ) => {
      args.push(function ( err, data ) {
        err ? reject(err) : resolve(data);
      });
      fn.apply(null, args);
    });
  }

  return _this ? promisified.bind(_this) : promisified

}
module.exports = {
  promisify,
  de_promisify
}