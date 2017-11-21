import {withTransition} from 'react-router-transitions'
import Layout from 'pages/mobile/treehole/layout'

export default {
  path: '/mobile/treehole',
  component: withTransition(Layout),
  indexRoute: {
    getComponent (location, callback) {
      require.ensure([], function (require) {
        callback(null, require('pages/mobile/treehole'))
      })
    }
  },
  childRoutes: [
    {
      path: 'topic',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/mobile/treehole/topic'))
        })
      }
    }, {
      path: 'me',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/mobile/treehole/me'))
        })
      }
    }
  ]
}
