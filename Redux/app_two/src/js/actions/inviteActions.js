import axios from 'axios'

export function getInfo () {
  return function (dispatch) {
    dispatch({
      type: 'GETINFO',
      payload: axios.get('../../assets/JSON/invite.json')
    })
  }
}

export function rewardInfo () {
  return function (dispatch) {
    dispatch({
      type: 'REWARD',
      payload: axios.get('../../assets/JSON/reward.json')
    })
  }
}

export function listOne () {
  return function (dispatch) {
    dispatch({
      type: 'LISTONE',
      payload: axios.get('../../assets/JSON/listOne.json')
    })
  }
}
