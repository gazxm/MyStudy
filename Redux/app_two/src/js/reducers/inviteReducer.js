export default function reducer (state = {
  dataCode: '',
  inviteCode: '',
  inviteUrl: '',
  reward: {},
  listOne: {},
  fetching: false,
  fetching2: false
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
      const data = action.payload.data
      return {
        ...state,
        fetching: false,
        dataCode: data.code,
        inviteCode: data.invite_code || '',
        inviteUrl: data.invite_url || ''
      }
    }
    case 'REWARD_PENDING': {
      return {
        ...state,
        fetching2: true
      }
    }
    case 'REWARD_REJECTED': {
      return {
        ...state,
        fetching2: false
      }
    }
    case 'REWARD_FULFILLED': {
      const data = action.payload.data
      return {
        ...state,
        fetching2: false,
        reward: data
      }
    }
    case 'LISTONE_PENDING': {
    	return {
    		...state,
    		fetching2: true
    	}
    }
    case 'LISTONE_REJECTED': {
    	return {
    		...state,
    		fetching2: false
    	}
    }
    case 'LISTONE_FULFILLED': {
    	const data = action.payload.data
    	return {
    		...state,
    		fetching2: false,
    		listOne: data
    	}
    }
  }
  return state
}
