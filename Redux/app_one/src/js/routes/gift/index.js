export default {
  path: 'gift',
  childRoutes: [
    {
      path: 'gift',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/gift/Gift'))
        })
      }
    }
  ]
}
