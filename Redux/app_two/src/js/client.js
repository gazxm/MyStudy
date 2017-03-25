require('string.prototype.startswith')
require('string.prototype.endswith')
require('es6-promise').polyfill()

import {census} from './utils'
census()

import React from 'react'
import ReactDOM from 'react-dom'
import {Router, hashHistory, browserHistory} from 'react-router'
import {rootRoute, routerTransition} from './routes'

import '../assets/scss/main.scss'

import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

import { Provider } from 'react-redux'
import store from './store'

const app = document.getElementById('app')
ReactDOM.render(
  <Provider store={store}>
    <Router routes={rootRoute} history={process.env.NODE_ENV === `debug` ? hashHistory : browserHistory} render={routerTransition}/>
  </Provider>,
app)
