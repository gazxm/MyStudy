import Layout from 'pages/mobile/Layout'
import {withTransition} from 'react-router-transitions'
import CertificationLayout from 'pages/mobile/certification/layout'
import ChannelLayout from 'pages/mobile/channel/layout'
import treeHole from './treehole'

export default {
  path: '/mobile',
  component: withTransition(Layout),
  indexRoute: {onEnter: (nextState, replace) => replace('/mobile/loan')},
  childRoutes: [
    treeHole,
    {
      path: 'loan',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/mobile/loan'))
        })
      }
    },
    {
      path: 'certification',
      indexRoute: [{
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/mobile/certification'))
          })
        }
      }],
      childRoutes: [
        {
          path: 'instruction',
          transition: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/certification/instruction'))
            })
          }
        }, {
          path: 'zhima',
          transition: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/certification/zhima'))
            })
          }
        }, {
          component: CertificationLayout,
          transition: 'from-right',
          childRoutes: [
            {
              path: 'information',
              transaction: 'from-right',
              getComponent (location, callback) {
                require.ensure([], function (require) {
                  callback(null, require('pages/mobile/certification/information'))
                })
              }
            }, {
              path: 'contacts',
              transaction: 'from-right',
              getComponent (location, callback) {
                require.ensure([], function (require) {
                  callback(null, require('pages/mobile/certification/contacts'))
                })
              }
            }, {
              path: 'bank',
              transaction: 'from-right',
              getComponent (location, callback) {
                require.ensure([], function (require) {
                  callback(null, require('pages/mobile/certification/bank'))
                })
              }
            }, {
              path: 'operator',
              transaction: 'from-right',
              getComponent (location, callback) {
                require.ensure([], function (require) {
                  callback(null, require('pages/mobile/certification/operators'))
                })
              }
            }, {
              path: 'operators',
              transaction: 'from-right',
              getComponent (location, callback) {
                require.ensure([], function (require) {
                  callback(null, require('pages/mobile/certification/operators'))
                })
              }
            }, {
              path: 'takeaway',
              transaction: 'from-right',
              getComponent (location, callback) {
                require.ensure([], function (require) {
                  callback(null, require('pages/mobile/certification/takeaway'))
                })
              }
            }, {
              path: 'cardVerify',
              transaction: 'from-right',
              getComponent (location, callback) {
                require.ensure([], function (require) {
                  callback(null, require('pages/mobile/certification/cardVerify'))
                })
              }
            }, {
              path: 'jobs',
              transaction: 'from-right',
              getComponent (location, callback) {
                require.ensure([], function (require) {
                  callback(null, require('pages/mobile/certification/jobs'))
                })
              }
            }, {
              transaction: 'from-right',
              childRoutes: [{
                path: 'credit/verify',
                transaction: 'from-right',
                getComponent (location, callback) {
                  require.ensure([], function (require) {
                    callback(null, require('pages/mobile/certification/credit/verify'))
                  })
                }
              }, {
                path: 'credit/import',
                transaction: 'from-right',
                getComponent (location, callback) {
                  require.ensure([], function (require) {
                    callback(null, require('pages/mobile/certification/credit/import'))
                  })
                }
              }, {
                path: 'credit/import/email',
                transaction: 'from-right',
                getComponent (location, callback) {
                  require.ensure([], function (require) {
                    callback(null, require('pages/mobile/certification/credit/email'))
                  })
                }
              }, {
                path: 'credit/import/bank',
                transaction: 'from-right',
                getComponent (location, callback) {
                  require.ensure([], function (require) {
                    callback(null, require('pages/mobile/certification/credit/bank'))
                  })
                }
              }, {
                path: 'credit/importing',
                transaction: 'from-right',
                getComponent (location, callback) {
                  require.ensure([], function (require) {
                    callback(null, require('pages/mobile/certification/credit/importing'))
                  })
                }
              }]
            }
          ]
        }, {
          path: 'credit',
          indexRoute: [{
            getComponent (location, callback) {
              require.ensure([], function (require) {
                callback(null, require('pages/mobile/certification/credit/index'))
              })
            }
          }]
        }
      ]
    },
    {
      path: 'find',
      indexRoute: [{
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/mobile/find'))
          })
        }
      }],
      childRoutes: [{
        path: 'article/:id',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/mobile/find/article'))
          })
        }
      }]
    },
    {
      path: 'settings',
      // indexRoute: [{
      //   getComponent (location, callback) {
      //     require.ensure([], function (require) {
      //       callback(null, require('pages/mobile/find'))
      //     })
      //   }
      // }],
      childRoutes: [{
        path: 'feedback',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/mobile/settings/feedback'))
          })
        }
      }, {
        path: 'credit-query',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/mobile/settings/credit-query'))
          })
        }
      }]
    },
    {
      path: 'me',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/mobile/me'))
        })
      }
    },
    {
      path: '',
      childRoutes: [
        {
          path: 'loan/:card_type/:period/:money(/:coupon_id)',
          transition: 'from-bottom',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/misc/Loan'))
            })
          }
        },
        {
          path: 'coupon',
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/misc/Coupon'))
            })
          }
        },
        {
          path: 'instructions',
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/misc/Instructions'))
            })
          }
        },
        {
          path: 'order',
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/misc/Order'))
            })
          }
        },
        {
          path: 'wechat',
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/misc/wechat'))
            })
          }
        },
        {
          path: 'add-quota',
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/misc/AddQuota'))
            })
          }
        },
        {
          path: 'wechat-repayment',
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/misc/wechat-repayment'))
            })
          }
        },
        {
          path: 'misc/native',
          transition: 'from-left',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/misc/native'))
            })
          }
        }
      ]
    },
    {
      path: 'repayment',
      childRoutes: [
        {
          path: 'result/:id',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/repayment/Result'))
            })
          }
        },
        {
          path: 'projet/:id',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/repayment/Projet'))
            })
          }
        },
        {
          path: 'feedback',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/repayment/feedback'))
            })
          }
        },
        {
          path: 'part',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/repayment/part'))
            })
          }
        },
        {
          path: 'transfer',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/repayment/transfer'))
            })
          }
        },
        {
          path: 'handling',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/repayment/handling'))
            })
          }
        },
        {
          path: 'alipay',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/repayment/alipay'))
            })
          }
        },
        {
          path: 'choose',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/repayment/choose'))
            })
          }
        }
      ]
    },
    {
      path: 'channel',
      component: ChannelLayout,
      transition: 'from-right',
      indexRoute: [{
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/mobile/channel/index'))
          })
        }
      }],
      childRoutes: [
        {
          path: 'certification',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/channel/certification'))
            })
          }
        }, {
          path: 'checkout',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/channel/checkout'))
            })
          }
        }, {
          path: 'result/:id',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/channel/result'))
            })
          }
        }
      ]
    },
    {
      path: 'wechatpay',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/mobile/wechatpay/wechatpay'))
        })
      }
    },
    {
      path: 'agreement',
      childRoutes: [
        {
          path: 'loan',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/agreement/Loan'))
            })
          }
        },
        {
          path: 'platformService',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/agreement/PlatformService'))
            })
          }
        },
        {
          path: 'authorization',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/agreement/Authorization'))
            })
          }
        },
        {
          path: 'crs',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/agreement/CRS'))
            })
          }
        },
        {
          path: 'hr-loan',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/agreement/HRLoan'))
            })
          }
        },
        {
          path: 'fo-loan',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/agreement/FOLoan'))
            })
          }
        },
        {
          path: 'ynxt',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/agreement/Ynxt'))
            })
          }
        },
        {
          path: 'advanced',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/agreement/Advanced'))
            })
          }
        },
        {
          path: 'privacy',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/agreement/Privacy'))
            })
          }
        },
        {
          path: 'third',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/agreement/Third'))
            })
          }
        },
        {
          path: 'micro-loan',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/agreement/MicroLoan'))
            })
          }
        },
        {
          path: 'people-message',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/agreement/PeopleMessage'))
            })
          }
        },
        {
          path: 'new-easy-loan',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/agreement/NewEasyLoan'))
            })
          }
        },
        {
          path: 'user-register',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/agreement/UserRegister'))
            })
          }
        }
      ]
    },
    {
      path: 'customer',
      getComponent (location, callback) {
        require.ensure([], function (require) {
          callback(null, require('pages/mobile/customer/Customer'))
        })
      }
    },
    {
      path: 'message-center',
      transaction: 'from-left',
      indexRoute: [{
        transition: 'from-left',
        getComponent (location, callback) {
          require.ensure([], function (require) {
            callback(null, require('pages/mobile/message-center/MessageCenter'))
          })
        }
      }],
      childRoutes: [
        {
          path: 'broadcast',
          transition: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/message-center/Broadcast'))
            })
          }
        },
        {
          path: 'loan-message',
          transition: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/message-center/LoanMessage'))
            })
          }
        },
        {
          path: 'coupon-toast',
          transition: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/message-center/CouponToast'))
            })
          }
        },
        {
          path: 'system-message',
          transition: 'from-right',
          getComponent (location, callback) {
            require.ensure([], function (require) {
              callback(null, require('pages/mobile/message-center/SystemMessage'))
            })
          }
        }
      ]
    }
  ]
}
