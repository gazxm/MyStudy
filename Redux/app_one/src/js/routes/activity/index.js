export default {
  path: 'activity',
  childRoutes: [
    {
      path: 'gift',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/gift/Gift'))
        })
      }
    }
  ]
}
