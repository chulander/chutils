'use strict';

const assign = function(obj){
  if(!obj || typeof obj !=='object'){
    return new TypeError('tyepof argument "obj" is not an object')
  } else {
    return Object.keys(obj).reduce((current,next)=>{
      const value = obj[next];
      const isArray = Array.isArray(value);
      const isObject = (val) => typeof val ==='object' && !Array.isArray(val);
      if(isObject(value)){
        // handle Objects
        if(Object.keys(value).some(isObject)){
          // handle keys that are also objects
          current[next] = Object.assign({}, assign(value))
        } else {
          // handles
          current[next] = Object.assign({}, value)
        }
      } else if(isArray) {
        // handle Arrays
        if(value.some(isObject)){
          // if any array element is an object
          current[next] = value.map(item=>assign(item))
        } else {
          // if array elements are not objects
          current[next] = [...value]
        }

      } else {
        // handle primitives
        current[next] = value
      }
      return current;
    }, {})
  }
}

module.exports ={
  assign
}