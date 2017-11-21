import Layout from 'pages/channel/m/Layout'
import certificationLayout from 'pages/channel/m/certification/layout'
import {withTransition} from 'react-router-transitions'

export default {
  path: '/channel/m',
  component: withTransition(Layout),
  indexRoute: {
    getComponent (location, callback) {
      require.ensure([], function (require) {
        callback(null, require('pages/channel/m'))
      })
    }
  },
  childRoutes: [{
    path: 'certification',
    indexRoute: {
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/channel/m/certification'))
        })
      }
    },
    childRoutes: [{
      component: certificationLayout,
      childRoutes: [{
        path: 'information',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/channel/m/certification/information'))
          })
        }
      }, {
        path: 'certificate',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/channel/m/certification/certificate'))
          })
        }
      }, {
        path: 'contacts',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/channel/m/certification/contacts'))
          })
        }
      }, {
        path: 'bank',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/channel/m/certification/bank'))
          })
        }
      }, {
        path: 'operator',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/channel/m/certification/operator'))
          })
        }
      }]
    }]
  }]
}
