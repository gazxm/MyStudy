export default function gift (
  state = {
    ruleState: false,
    tabState: true,
    fetching: false,
    popupState: {
      isShow: false,
      tip: '',
      content: '',
      callback: ''
    },
    valentineInfo: {
      surplus: 0,
      chance: '0',
      code: '',
      message: '',
      myNumber: {},
      luckyInfo: [],
      is_open_lottery: '',
      last_period_no: '',
      lovefund_tender_total_num: ''
    }
  }, action) {
  switch (action.type) {
    case 'GETINFO_PENDING': {
      return {
        ...state,
        fetching: true
      }
    }
    case 'GETINFO_REJECTED': {
      return {
        ...state,
        fetching: false
      }
    }
    case 'GETINFO_FULFILLED': {
      return {
        ...state,
        fetching: false,
        tabState: action.payload.data.data === 1,
        valentineInfo: action.payload.data
      }
    }
    case 'FESTIVAL': {
      return {tabState: true}
    }
    case 'VALENTINE': {
      return {tabState: false}
    }
  }
  return state
}
