import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'

import reducer from './reducers'

const middlewares = [promise(), thunk]
let store = createStore(reducer, applyMiddleware(...middlewares))

if (process.env.NODE_ENV === `develop`) {
  const createLogger = require(`redux-logger`)
  const logger = createLogger()
  middlewares.push(logger)
  store = createStore(reducer, composeWithDevTools(applyMiddleware(...middlewares)))
}

export default store
