export default {
  path: 'test',
  childRoutes: [
    {
      path: 'SetState',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/test/SetState'))
        })
      }
    }
  ]
}
