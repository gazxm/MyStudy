export default {
  path: 'example',
  childRoutes: [
    {
      path: 'father',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/example/Father'))
        })
      }
    },
    {
      path: 'example',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/example/Example'))
        })
      }
    }
  ]
}
