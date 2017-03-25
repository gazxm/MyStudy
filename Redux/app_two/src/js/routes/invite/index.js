export default {
  path: 'invite',
  indexRoute: [
    {
      transition: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/invite/Invite'))
        })
      }
    }
  ],
  childRoutes: [
    {
      path: 'share',
      transaction: 'from-right',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/invite/Share'))
        })
      }
    },
    {
      path: 'reward',
      transaction: 'from-right',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/invite/Reward'))
        })
      }
    }
  ]
}
