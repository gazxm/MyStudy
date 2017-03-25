import { combineReducers } from 'redux'

import securityFund from './securityFundReducer'
import exampleReducer from './exampleReducer'
import giftReducer from './giftReducer'

export default combineReducers({
  securityFund,
  exampleReducer,
  giftReducer
})
