'use strict'

const source = {
  package: {
    name: 'chutils'
  },
  dependencies: {
    packageName: 'testPackage'
  },
  nested: {
    firstLayer: {
      primitive: 'firstLayerPrimitive',
      arr: ['randomString', {name: 'randomLastName'}, 1, 2, 3],
      obj: {
        primitive: 'firstLayerObjectPrimitive',
        arr: ['randomString', {name: 'randomLastName'}, 1, 2, 3]
      },
      secondLayer: {
        primitive: 'secondLayerPrimitive',
        arr: ['randomString', {name: 'randomLastName'}, 1, 2, 3],
        obj: {
          primitive: 'secondLayerObjectPrimitive',
          arr: ['randomString', {name: 'randomLastName'}, 1, 2, 3],
          promiseObj: Promise.resolve()
        },
        '0': 'primitiveNumberAsKey'
      }
    }
  }
}

module.exports = {
  getSource: function () {
    return source
  }
}
