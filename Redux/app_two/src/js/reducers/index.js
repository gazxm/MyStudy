import { combineReducers } from 'redux'

import securityFund from './securityFundReducer'
import invite from './inviteReducer'

export default combineReducers({
  securityFund,
  invite
})
