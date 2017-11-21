export default {
  path: '',
  childRoutes: [
    //  邀请活动第四期
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
    //  砸蛋活动
    {
      path: 'eggs',
      transaction: 'from-left',
      indexRoute: [
        {
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/eggs/index'))
            })
          }
        }
      ]
    },
    //  日历活动
    {
      path: 'calendar',
      transaction: 'from-left',
      indexRoute: [
        {
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/calendar/calendar'))
            })
          }
        }
      ],
      childRoutes: [
        {
          path: 'today',
          transition: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/calendar/today'))
            })
          }
        }, {
          path: 'banner',
          transition: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/calendar/banner'))
            })
          }
        }
      ]
    },
    //  分享红包活动
    {
      path: 'share',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/share/Share'))
        })
      }
    },
    //  大转盘活动1
    {
      path: 'turntable',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/turntable/Turntable'))
        })
      }
    },
    //  生日活动
    {
      path: 'birthday',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/birthday/Birthday'))
        })
      }
    },
    //  团借活动
    {
      path: 'group-loan',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/group-loan/GroupLoan'))
        })
      }
    },
    //  秒杀活动
    {
      path: 'seckill',
      indexRoute: [
        {
          transition: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/seckill/Seckill'))
            })
          }
        }
      ]
    },
    //  夺宝活动
    {
      path: 'treasure',
      transaction: 'from-left',
      indexRoute: [
        {
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/treasure'))
            })
          }
        }
      ],
      childRoutes: [{
        path: 'rule',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/treasure/Rule'))
          })
        }
      }]
    },
    //  智能评测活动
    {
      path: 'evaluation',
      indexRoute: [
        {
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/inte-eval/Evaluation'))
            })
          }
        }
      ],
      childRoutes: [{
        path: 'stepone',
        transition: 'from-right',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/inte-eval/Stepone'))
          })
        }
      }, {
        path: 'steptwo',
        transition: 'from-right',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/inte-eval/Steptwo'))
          })
        }
      }, {
        path: 'result',
        transition: 'from-right',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/inte-eval/Result'))
          })
        }
      }]
    },
    //  刮刮卡活动
    {
      path: 'scratch',
      transaction: 'from-left',
      indexRoute: [
        {
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/scratch-card/Scratch'))
            })
          }
        }
      ]
    },
    //  大转盘活动2
    {
      path: 'turntable-two',
      transaction: 'from-left',
      indexRoute: [
        {
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/turntableTwo/TurntableTwo'))
            })
          }
        }
      ]
    },
    //  新手活动系列
    {
      path: 'novice',
      transaction: 'from-left',
      indexRoute: [
        {
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/novice/Novice'))
            })
          }
        }
      ],
      childRoutes: [{
        path: 'forward',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/novice/Forward'))
          })
        }
      },
      {
        path: 'xinshou',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/novice/XinshouTwo'))
          })
        }
      }]
    },
    //  私人订制活动
    {
      path: 'personal-tailor',
      transaction: 'from-left',
      indexRoute: [
        {
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/personal-tailor'))
            })
          }
        }
      ]
    },
    //  6180活动
    {
      path: 'lay-out',
      transaction: 'from-left',
      indexRoute: [
        {
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/lay-out/index'))
            })
          }
        }
      ]
    },
    //  全民猜猜猜活动
    {
      path: 'guess',
      indexRoute: [{
        transition: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/guess/guess'))
          })
        }
      }],
      childRoutes: [{
        path: 'topic',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/guess/topic'))
          })
        }
      }]
    },
    //  赚钱活动
    {
      path: 'money',
      indexRoute: [
        {
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/make-money/money'))
            })
          }
        }
      ]
    },
    //  活动日活动
    {
      path: 'activity-day',
      indexRoute: [{
        transition: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/activity-day/ActivityDay'))
          })
        }
      }],
      childRoutes: [
        {
          path: 'back',
          transaction: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/activity-day/Back'))
            })
          }
        },
        {
          path: 'gold',
          transaction: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/activity-day/Gold'))
            })
          }
        },
        {
          path: 'free',
          transaction: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/activity-day/Free'))
            })
          }
        },
        {
          path: 'back-two',
          transaction: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/activity-day/BackTwo'))
            })
          }
        }
      ]
    },
    // 卡迷特权活动
    {
      path: 'privilege',
      indexRoute: [{
        transition: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/privilege'))
          })
        }
      }]
    },
    //  发布会活动
    {
      path: 'release',
      indexRoute: [{
        transition: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/release/Release'))
          })
        }
      }]
    },
    //  复借活动
    {
      path: 'repeat-loan',
      indexRoute: [{
        transition: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/repeat-loan/Loan'))
          })
        }
      }]
    },
    //  金粉关怀日活动
    {
      path: 'gold-powder',
      indexRoute: [{
        transition: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/gold-powder/GoldPowder'))
          })
        }
      }],
      childRoutes: [
        {
          path: 'shop',
          transaction: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/gold-powder/Shop'))
            })
          }
        },
        {
          path: 'transition',
          transaction: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/gold-powder/Transition'))
            })
          }
        }
      ]
    },
    //  金粉关怀日活动二期
    {
      path: 'gold-powder-two',
      indexRoute: [{
        transition: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/gold-powder-two/GoldPowderTwo'))
          })
        }
      }],
      childRoutes: [
        {
          path: 'shop',
          transaction: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/gold-powder-two/Shop'))
            })
          }
        },
        {
          path: 'dream-detail',
          transaction: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/gold-powder-two/DreamDetail'))
            })
          }
        },
        {
          path: 'transition',
          transaction: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/gold-powder-two/Transition'))
            })
          }
        }
      ]
    },
    //  邀请达人活动
    {
      path: 'invite-people',
      indexRoute: [{
        transition: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/invite-people/Invite'))
          })
        }
      }]
    },
    //  邀请达人活动第二期
    {
      path: 'invite-people-two',
      indexRoute: [{
        transition: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/invite-people-two/Invite'))
          })
        }
      }]
    },
    //  升级活动
    {
      path: 'update',
      transaction: 'from-left',
      indexRoute: [
        {
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/activity/update/update'))
            })
          }
        }
      ]
    },
    //  第二单半价活动
    {
      path: 'half-price',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/half-price'))
        })
      }
    },
    //  金卡来啦活动
    {
      path: 'gold-bulletin',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/gold-bulletin/Gold'))
        })
      }
    },
    //  现金大礼包活动
    {
      path: 'cash-gift',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/cash-gift/index'))
        })
      }
    },
    //  霸王令活动
    {
      path: 'overlord',
      indexRoute: [{
        transition: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/overlord-order/Overlord'))
          })
        }
      }],
      childRoutes: [{
        path: 'pay',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/overlord-order/Pay'))
          })
        }
      },
      {
        path: 'service',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/overlord-order/Service'))
          })
        }
      },
      {
        path: 'auth',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/overlord-order/Auth'))
          })
        }
      },
      {
        path: 'platform',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/overlord-order/platform'))
          })
        }
      },
      {
        path: 'loan',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/overlord-order/Loan'))
          })
        }
      },
      {
        path: 'result',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/overlord-order/Result'))
          })
        }
      }]
    },
    // 特权营活动
    {
      path: 'prerogative',
      indexRoute: [{
        transition: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/prerogative/Prerogative'))
          })
        }
      }],
      childRoutes: [{
        path: 'privilege',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/prerogative/privilege'))
          })
        }
      },
      {
        path: 'PrerogativeOld',
        transaction: 'from-right',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/prerogative/PrerogativeOld'))
          })
        }
      }]
    },
    // 七夕节活动
    {
      path: 'tanabata',
      indexRoute: [{
        transition: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/tanabata/Tanabata'))
          })
        }
      }],
      childRoutes: [{
        path: 'follow',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/tanabata/Follow'))
          })
        }
      },
      {
        path: 'friend',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/tanabata/Friend'))
          })
        }
      },
      {
        path: 'friTanabata',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/tanabata/FriTanabata'))
          })
        }
      },
      {
        path: 'viewAll',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/tanabata/ViewAll'))
          })
        }
      },
      {
        path: 'register',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/tanabata/Register'))
          })
        }
      }]
    },
    // 周周乐活动
    {
      path: 'week-happy',
      indexRoute: [{
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/week-happy/WeekHappy'))
          })
        }
      }],
      childRoutes: [{
        path: 'award-history',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/week-happy/AwardHistory'))
          })
        }
      },
      {
        path: 'gold-exchange',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/week-happy/GoldExchange'))
          })
        }
      },
      {
        path: 'my-history',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/week-happy/MyHistory'))
          })
        }
      },
      {
        path: 'scratch',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/week-happy/Scratch'))
          })
        }
      },
      {
        path: 'rule',
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/week-happy/Rule'))
          })
        }
      }]
    }, {
      path: 'compensate',
      indexRoute: [{
        transaction: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/activity/compensate'))
          })
        }
      }]
    }
  ]
}
