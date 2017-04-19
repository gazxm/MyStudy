export default {
  path: 'activity',
  childRoutes: [
    /* {
      path: 'gift',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/gift/Gift'))
        })
      }
    },
    {
      path: 'freetrips',
      transaction: 'from-left',
      indexRoute: [
        {
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/freetrips/Freetrips'))
            })
          }
        }
      ],
      childRoutes: [
        {
          path: 'tour',
          transition: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/freetrips/Freeluddite'))
            })
          }
        }
      ]
    },
    {
      path: 'women',
      transaction: 'from-left',
      indexRoute: [
        {
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/women/Women'))
            })
          }
        }
      ],
      childRoutes: [
        {
          path: 'tour',
          transition: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/women/WomenShare'))
            })
          }
        }
      ]
    }, */
    {
      path: 'invite',
      transaction: 'from-left',
      indexRoute: [
        {
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/invite/Invite'))
            })
          }
        }
      ],
      childRoutes: [
        {
          path: 'reward',
          transition: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/invite/Reward'))
            })
          }
        },
        {
          path: 'share',
          transition: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/invite/Share'))
            })
          }
        }
      ]
    },
    {
      path: 'share',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/share/Share'))
        })
      }
    },
    {
      path: 'test',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/test/test'))
        })
      }
    }
  ]
}
