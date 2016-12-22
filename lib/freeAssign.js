function freeAssign(obj, assignment, val){
  const _recursive = function iterate(obj,assignment, val){
    const props = assignment.split('.');
    const prop=props.shift();
    return {
      [prop]: (props.length===0)
        ? val
        :  Object.assign({},obj[prop], iterate(obj, props.join('.'), val))
    }
  }
  return Object.assign({},obj, _recursive(obj,assignment,val))
}

module.exports = freeAssign