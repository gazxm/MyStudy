// require('string.prototype.startswith')
// require('string.prototype.endswith')
import './flexible'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import {census, sensors, report} from './utils'
import qc from 'common/qiancheng'

import 'antd-mobile/dist/antd-mobile.less'
import 'scss/main.scss'

import axios from 'axios'
require('es6-promise').polyfill()

report()

// var FastClick = require('fastclick')
// FastClick.attach(document.body)

census()
sensors()

axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

qc.track('getSessionID').then(response => {
  let {sessionid} = response.data
  if (sessionid) {
    // document.cookie = `SESSIONID=;path=/;domain=.xianjincard.com;`
    // document.cookie = `SESSIONID=${sessionid};path=/;domain=.xianjincard.com;`
    axios.defaults.headers.common['Token'] = sessionid
  }
}).catch(() => {})

const app = document.getElementById('app')

const render = () => {
  import('./routes').then(({ default: Component }) => {
    ReactDOM.render(
      <AppContainer>
        <Component />
      </AppContainer>,
      app
    )
  })
}

render()

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./routes', render)
}
