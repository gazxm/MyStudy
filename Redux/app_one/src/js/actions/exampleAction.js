export function exampleOne () {
  return function (dispatch) {
    dispatch({
      type: 'EXAMPLE_ONE',
      payload: ''
    })
  }
}

export function exampleTwo () {
  return function (dispatch) {
    dispatch({
      type: 'EXAMPLE_TWO',
      payload: ''
    })
  }
}

export function exampleThree () {
  return function (dispatch) {
    dispatch({
      type: 'EXAMPLE_THREE',
      payload: { list: { number: 10 } }
    })
  }
}

export function exampleFour () {
  return function (dispatch) {
    dispatch({
      type: 'EXAMPLE_FOUR',
      payload: ''
    })
  }
}
