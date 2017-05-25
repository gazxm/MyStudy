import axios from 'axios'
import * as utils from '../utils'
import qs from 'qs'

export function fetchFundUser () {
  return function (dispatch) {
    dispatch({
      type: 'FETCH_SF_USER',
      payload: axios.get(utils.resolveUrl('http://api.xianjincard.com/accumulation-fund/get-user-info'))
    })
  }
}

export function fetchFundList () {
  return function (dispatch) {
    dispatch({
      type: 'FETCH_SF_LIST',
      payload: axios.get(utils.resolveUrl('http://api.xianjincard.com/accumulation-fund/get-info-list'))
    })
  }
}

export function fetchFundForm (data) {
  return function (dispatch) {
    dispatch({
      type: 'FETCH_SF_USER_SORT',
      payload: axios.post(utils.resolveUrl('http://api.xianjincard.com/accumulation-fund/get-login-type'), data)
    })
  }
}

export function verifyFund (data) {
  return function (dispatch) {
    dispatch({
      type: 'FETCH_SF_USER_VERIFY',
      payload: axios.post(utils.resolveUrl('http://api.xianjincard.com/accumulation-fund/check-login'), qs.stringify(data))
    })
  }
}

export function verifyFundReset () {
  return function (dispatch) {
    dispatch({
      type: 'FETCH_SF_USER_VERIFY_RESET'
    })
  }
}

export function changeFundFields (data) {
  return function (dispatch) {
    dispatch({
      type: 'FETCH_SF_USER_TAB_FIELDS_CHANGE',
      payload: data
    })
  }
}
// social security action
export function fetchSecurityUser () {
  return function (dispatch) {
    dispatch({
      type: 'FETCH_SF_USER',
      payload: axios.get(utils.resolveUrl('http://api.xianjincard.com/social-security/get-user-info'))
    })
  }
}

export function fetchSecurityList () {
  return function (dispatch) {
    dispatch({
      type: 'FETCH_SF_LIST',
      payload: axios.get(utils.resolveUrl('http://api.xianjincard.com/social-security/get-info-list'))
    })
  }
}

export function fetchSecurityForm (code) {
  return function (dispatch) {
    dispatch({
      type: 'FETCH_SF_USER_SORT',
      payload: axios.get(utils.resolveUrl('http://api.xianjincard.com/social-security/get-form') + '?city_code=' + code)
    })
  }
}

export function verifySecurity (data) {
  return function (dispatch) {
    dispatch({
      type: 'FETCH_SF_USER_VERIFY',
      payload: axios.post(utils.resolveUrl('http://api.xianjincard.com/social-security/check-login'), qs.stringify(data))
    })
  }
}

export function verifySecurityReset () {
  return function (dispatch) {
    dispatch({
      type: 'FETCH_SF_USER_VERIFY_RESET'
    })
  }
}

export function changeSecurityFields (data) {
  return function (dispatch) {
    dispatch({
      type: 'FETCH_SF_USER_TAB_FIELDS_CHANGE',
      payload: data
    })
  }
}

export function changeSecuritySorts (data) {
  return function (dispatch) {
    dispatch({
      type: 'FETCH_SF_USER_SORT_FIELDS_CHANGE',
      payload: data
    })
  }
}
