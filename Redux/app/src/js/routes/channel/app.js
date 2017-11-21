import layout from 'pages/channel/app/layout'

export default {
  path: '/channel/app',
  component: layout,
  indexRoute: {
    getComponent (location, callback) {
      require.ensure([], function (require) {
        callback(null, require('pages/channel/app'))
      })
    }
  },
  childRoutes: [{
    path: 'operator',
    getComponent (location, callback) {
      require.ensure([], function (require) {
        callback(null, require('pages/channel/app/operator'))
      })
    }
  }, {
    path: 'bank',
    getComponent (location, callback) {
      require.ensure([], function (require) {
        callback(null, require('pages/channel/app/bank'))
      })
    }
  }, {
    path: 'bank/state',
    getComponent (location, callback) {
      require.ensure([], function (require) {
        callback(null, require('pages/channel/app/bankState'))
      })
    }
  }, {
    path: 'information',
    getComponent (location, callback) {
      require.ensure([], function (require) {
        callback(null, require('pages/channel/app/information'))
      })
    }
  }, {
    path: 'repayment',
    childRoutes: [{
      path: 'list',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/channel/app/repayment/list'))
        })
      }
    }, {
      path: 'plan',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/channel/app/repayment/plan'))
        })
      }
    }, {
      path: 'result',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/channel/app/repayment/result'))
        })
      }
    }]
  }, {
    path: 'product',
    childRoutes: [{
      path: 'list',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/channel/app/product/list'))
        })
      }
    }]
  }, {
    path: 'loan',
    childRoutes: [{
      path: 'checkout',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/channel/app/loan/checkout'))
        })
      }
    }, {
      path: 'details',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/channel/app/loan/details'))
        })
      }
    }]
  }]
}
