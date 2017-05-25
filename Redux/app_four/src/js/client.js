require('string.prototype.startswith')
require('string.prototype.endswith')
require('es6-promise').polyfill()
require('flexible')
// require('babel-polyfill')

import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import {census} from './utils'
census()

import App from './routes'

import '../assets/scss/main.scss'

import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

const app = document.getElementById('app')

if (process.env.NODE_ENV === `develop`) {
  ReactDOM.render(<AppContainer><App/></AppContainer>, app)
  if (module.hot) {
    module.hot.accept('./routes', () => {
      const NextApp = require('./routes').default
      ReactDOM.render(
        <AppContainer>
          <NextApp />
        </AppContainer>,
        app
      )
    })
  }
} else {
  ReactDOM.render(<App/>, app)
}
