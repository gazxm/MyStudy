import commenRoute from './commen-use'
import temporaryRoute from './temporary'

export default {
  path: 'activity',
  childRoutes: [
    commenRoute,
    temporaryRoute,
    {
      path: 'interest-free',
      indexRoute: [
        {
          transaction: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/interest-free/index'))
            })
          }
        }
      ],
      childRoutes: [
        {
          path: 'share',
          transition: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/interest-free/Share'))
            })
          }
        }
      ]
    },
    {
      path: 'ios-entry',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/ios-entry/index'))
        })
      }
    },
    {
      path: 'imeme',
      transaction: 'from-left',
      indexRoute: {
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/imeme'))
          })
        }
      },
      childRoutes: [{
        path: 'login',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/imeme/login'))
          })
        }
      }, {
        path: 'register',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/imeme/register'))
          })
        }
      }]
    }
  ]
}
