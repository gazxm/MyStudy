export default {
  path: '',
  childRoutes: [
    /*
    //  开春有礼活动
    {
      path: 'gift',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/gift/Gift'))
        })
      }
    },
    //  云南免费游活动
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
    //  3.8妇女节活动
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
    },
    //  愚人节活动
    {
      path: 'fool',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/fool/Fool'))
        })
      }
    },
    //  借钱不用还活动
    {
      path: 'notback',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/notback/notBack'))
        })
      }
    },
    //  母亲节活动
    {
      path: 'mother',
      transaction: 'from-left',
      indexRoute: [
        {
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/mother-day/Mother'))
            })
          }
        }
      ],
      childRoutes: [{
        path: 'share',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/mother-day/Share'))
          })
        }
      }]
    },
    //  520活动
    {
      path: 'love',
      transaction: 'from-left',
      indexRoute: [
        {
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/love/love'))
            })
          }
        }
      ]
    },
    //  父亲节活动
    {
      path: 'father-day',
      transaction: 'from-left',
      indexRoute: [
        {
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/father-day/index'))
            })
          }
        }
      ]
    },
    //  端午节活动
    {
      path: 'dragon',
      transaction: 'from-left',
      indexRoute: [
        {
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/dragon/dragon'))
            })
          }
        }
      ]
    },
    //  五一劳动节活动
    {
      path: 'laborday',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/laborday/Laborday'))
        })
      }
    },
    //  体验金卡活动
    {
      path: 'gold',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/experience-gold/Gold'))
        })
      }
    },
    //  金卡专享活动
    {
      path: 'gold-vip',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/gold-vip/index'))
        })
      }
    },
    //  周四免息活动
    {
      path: 'thursday-freeinterest',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/thursday-freeinterest'))
        })
      }
    }
    */
    {
      path: 'baidu',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/baidu/index'))
        })
      }
    }
  ]
}
