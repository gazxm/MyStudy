export default {
  path: 'employer',
  childRoutes: [
    {
      path: 'login',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/employer/Login'))
        })
      }
    },
    {
      path: 'list',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/employer/Thelist'))
        })
      }
    }
  ]
}
