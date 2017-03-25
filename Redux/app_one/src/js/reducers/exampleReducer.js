export default function example (
  state = {
    list: {
      number: 0
    }
  }, action) {
  switch (action.type) {
    case 'EXAMPLE_ONE': {
      return {list: {number: 1}}
    }
    case 'EXAMPLE_TWO': {
      return {list: {number: 2}}
    }
    case 'EXAMPLE_THREE': {
      return {list: {number: action.payload.list.number}}
    }
  }
  return state
}
