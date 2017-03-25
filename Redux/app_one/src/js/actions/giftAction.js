import axios from 'axios'
import * as utils from '../utils'

export function getInfo () {
  return function (dispatch) {
    dispatch({
      type: 'GETINFO',
      payload: axios.get(utils.resolveUrl('http://credit.xianjincard.com/act/two-start'))
    })
  }
}

export function festival () {
  return function (dispatch) {
    dispatch({
      type: 'FESTIVAL',
      payload: ''
    })
  }
}

export function valentine () {
  return function (dispatch) {
    dispatch({
      type: 'VALENTINE',
      payload: ''
    })
  }
}
