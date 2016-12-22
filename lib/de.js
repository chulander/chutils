const promisify = function (fn){
  if(!fn || typeof fn !== 'function') throw new TypeError('error: de-promisify must be called with a function');
  return function (...args){
    const originalArgs = args.slice(0);
    const cb = args.pop();
    const isFunction = (typeof cb === 'function');
    if(!isFunction){
      console.info('last argument is not a callback function, calling original arguments')
      try {
        return fn(...originalArgs);
      } catch (e) {
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

module.exports = {
  promisify
}