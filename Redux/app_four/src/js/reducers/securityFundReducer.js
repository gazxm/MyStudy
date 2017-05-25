export default function reducer (
  state = {
    list: {
      items: [],
      fetching: false,
      fetched: false,
      code: 0,
      message: null
    },
    verify: {
      user: {
        name: null,
        id_card: null,
        city: []
      },
      sort: null,
      sorts: null,
      fields: null,
      tabs: null,
      fetching: false,
      fetched: false,
      code: 0,
      message: null
    }
  }, action) {
  switch (action.type) {
    case 'FETCH_SF_LIST_PENDING': {
      return {...state, list: {fetching: true, fetched: false, code: 0, message: null}, verify: {...state.verify, code: 0, message: null}}
    }
    case 'FETCH_SF_LIST_REJECTED': {
      return {...state, list: {fetching: false, error: action.payload}}
    }
    case 'FETCH_SF_LIST_FULFILLED': {
      return {
        ...state,
        list: {
          fetching: false,
          fetched: true,
          items: action.payload.data.data,
          code: action.payload.data.code,
          message: action.payload.data.message
        }
      }
    }
    case 'FETCH_SF_USER_PENDING': {
      return {
        ...state,
        verify: {
          user: {
            name: null,
            id_card: null,
            city: []
          },
          sort: null,
          fields: null,
          tabs: null,
          fetching: true,
          fetched: false,
          code: 0,
          message: null
        }
      }
    }
    case 'FETCH_SF_USER_REJECTED': {
      return {...state, verify: {fetching: false, error: action.payload}}
    }
    case 'FETCH_SF_USER_FULFILLED': {
      return {
        ...state,
        verify: {
          fetching: false,
          fetched: true,
          user: action.payload.data.data || {name: null, id_card: null, city: []},
          code: action.payload.data.code,
          message: action.payload.data.message
        }
      }
    }
    case 'FETCH_SF_USER_SORT_PENDING': {
      return {
        ...state,
        verify: {
          ...state.verify,
          fetching: true,
          fetched: false,
          code: 0,
          message: null
        }
      }
    }
    case 'FETCH_SF_USER_SORT_REJECTED': {
      return {...state, verify: {...state.verify, fetching: false, fetched: true, error: action.payload}}
    }
    case 'FETCH_SF_USER_SORT_FULFILLED': {
      const data = action.payload.data.data
      const sort = data ? data.length === 1 ? data[0] : data : null
      const sorts = data ? data.length > 1 ? data : null : null
      return {
        ...state,
        verify: {
          ...state.verify,
          fetching: false,
          fetched: true,
          sort: sort,
          sorts: sorts,
          tabs: sort && sort.tabs && sort.tabs.length > 1 ? sort.tabs : null,
          fields: sort && sort.tabs && sort.tabs.length === 1 ? sort.tabs[0].field : null,
          code: action.payload.data.code,
          message: action.payload.data.message
        }
      }
    }
    case 'FETCH_SF_USER_TAB_FIELDS_CHANGE': {
      return {
        ...state,
        verify: {
          ...state.verify,
          fields: action.payload
        }
      }
    }
    case 'FETCH_SF_USER_SORT_FIELDS_CHANGE': {
      return {
        ...state,
        verify: {
          ...state.verify,
          sort: action.payload,
          tabs: action.payload.tabs,
          fields: null
        }
      }
    }
    case 'FETCH_SF_USER_VERIFY_PENDING': {
      return {...state, verify: {...state.verify, fetching: true, fetched: false, code: 0, message: null}}
    }
    case 'FETCH_SF_USER_VERIFY_REJECTED': {
      return {...state, verify: {...state.verify, fetching: false, fetched: true, error: action.payload}}
    }
    case 'FETCH_SF_USER_VERIFY_FULFILLED': {
      return {
        ...state,
        verify: {
          ...state.verify,
          fetching: false,
          fetched: true,
          code: action.payload.data.code,
          message: action.payload.data.message
        }
      }
    }
    case 'FETCH_SF_USER_VERIFY_RESET': {
      return {
        ...state,
        verify: {
          ...state.verify,
          sort: null,
          sorts: null,
          fields: null,
          tabs: null,
          fetching: false,
          fetched: true,
          code: 0,
          message: null
        }
      }
    }
  }
  return state
}
