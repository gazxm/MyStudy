import {useTransitions, withTransition} from 'react-router-transitions'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {applyRouterMiddleware} from 'react-router'
import Layout from '../pages/Layout'
import activityRoute from './activity'
import employerRoute from './employer'

export const routerTransition = applyRouterMiddleware(
  useTransitions({
    TransitionGroup: ReactCSSTransitionGroup,
    onShow (prevState, nextState, replaceTransition) {
      // console.log('onShow',nextState.children.props.route.transition)
      replaceTransition({
        transitionName: `transition-group-show-${nextState.children.props.route.transition}`,
        transitionEnterTimeout: 800,
        transitionLeaveTimeout: 200
      })
    },
    onDismiss (prevState, nextState, replaceTransition) {
      // console.log('onDismiss', nextState.children.props.route.transition)
      replaceTransition({
        transitionName: `transition-group-show-${nextState.children.props.route.transition}`,
        transitionEnterTimeout: 800,
        transitionLeaveTimeout: 200
      })
    },
    defaultTransition: {
      transitionName: 'transition-group-show-from-right',
      transitionEnterTimeout: 800,
      transitionLeaveTimeout: 200
    }}))

export const rootRoute = [
  {
    path: '/',
    component: withTransition(Layout),
    childRoutes: [
      {
        path: 'security',
        transition: 'from-left',
        indexRoute: [
          {
            transition: 'from-left',
            getComponent (location, callback) {
              require.ensure([], function (require) {
                callback(null, require('../pages/security/SecurityList'))
              })
            }
          }
        ],
        childRoutes: [
          {
            path: 'certification',
            transition: 'from-right',
            getComponent (location, callback) {
              require.ensure([], function (require) {
                callback(null, require('../pages/security/SecurityCertification'))
              })
            }
          }
        ]
      },
      {
        path: 'fund',
        transition: 'from-left',
        indexRoute: [
          {
            transition: 'from-left',
            getComponent (location, callback) {
              require.ensure([], function (require) {
                callback(null, require('../pages/fund/FundList'))
              })
            }
          }
        ],
        childRoutes: [
          {
            path: 'certification',
            transition: 'from-right',
            getComponent (location, callback) {
              require.ensure([], function (require) {
                callback(null, require('../pages/fund/FundCertification'))
              })
            }
          }
        ]
      },
      activityRoute,
      employerRoute,
      {
        path: 'signin',
        indexRoute: [
          {
            transaction: 'from-left',
            getComponent (location, callback) {
              require.ensure([], function (require) {
                callback(null, require('pages/signin/index'))
              })
            }
          }],
        childRoutes: [
          {
            path: 'detailed',
            transaction: 'from-right',
            getComponent (location, callback) {
              require.ensure([], function (require) {
                callback(null, require('pages/signin/detailed'))
              })
            }
          }
        ]
      },
      {
        path: 'misc',
        childRoutes: [
          {
            path: 'flow',
            transaction: 'from-left',
            getComponent (location, callback) {
              require.ensure([], function (require) {
                callback(null, require('pages/misc/flow'))
              })
            }
          }
        ]
      }
    ]
  }
]
