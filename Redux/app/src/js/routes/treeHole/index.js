export default {
  path: 'tree-hole',
  transaction: 'from-left',
  indexRoute: [
    {
      transition: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/tree-hole/index'))
        })
      }
    }
  ],
  childRoutes: [
    {
      path: 'topic',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/tree-hole/Topic'))
        })
      }
    }
  ]
}
