function safeAssign(obj, assignment, val){
  if (typeof assignment !=='string'){
    return new TypeError('assignment parameter must be a string')
  } else {
    const props = assignment.split('.');
    const prop=props.shift();
    return Object.assign({}, obj, {
      [prop]: (props.length===0)
        ? val
        :  Object.assign({},obj[prop], safeAssign({}, props.join('.'), val))
    })
  }
}

module.exports = safeAssign