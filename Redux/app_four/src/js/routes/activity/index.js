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
      path: 'cash-gift',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/cash-gift/index'))
        })
      }
    },
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
      path: 'turntable',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/turntable/Turntable'))
        })
      }
    },
    {
      path: 'thursday-freeinterest',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/thursday-freeinterest'))
        })
      }
    },
    /* {
       path: 'fool',
       transaction: 'from-left',
       getComponent (location, callback) {
       require.ensure([], function (require) {
       callback(null, require('pages/activity/fool/Fool'))
       })
       }
       }, */
    {
      path: 'gold',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/experience-gold/Gold'))
        })
      }
    },
    {
      path: 'half-price',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/half-price'))
        })
      }
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
    /* {
       path: 'notback',
       transaction: 'from-left',
       getComponent (location, callback) {
       require.ensure([], function (require) {
       callback(null, require('pages/activity/notback/notBack'))
       })
       }
       }, */
    {
      path: 'birthday',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/birthday/Birthday'))
        })
      }
    },
    {
      path: 'group-loan',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/group-loan/GroupLoan'))
        })
      }
    },
    {
      path: 'seckill',
      transaction: 'from-left',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/activity/seckill/Seckill'))
        })
      }
    },
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
      }]
    }
    /* {
       path: 'laborday',
       transaction: 'from-left',
       getComponent (location, callback) {
       require.ensure([], function (require) {
       callback(null, require('pages/activity/laborday/Laborday'))
       })
       }
       } */
  ]
}