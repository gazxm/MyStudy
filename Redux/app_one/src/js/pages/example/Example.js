import React from 'react'
import {connect} from 'react-redux'

import * as example from '../../actions/exampleAction'

@connect((store) => {
  const list = store.exampleReducer.list
  console.log(list.number)
  return {
    number: list.number
  }
})
export default class Example extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    const { number } = this.props
    console.log(number)
  }

  componentWillUpdate () {
  }

  onClickOne (e) {
    this.props.dispatch(example.exampleOne())
  }

  onClickTwo (e) {
    this.props.dispatch(example.exampleTwo())
  }

  onClickThree (e) {
    this.props.dispatch(example.exampleThree())
  }

  onClickFour (e) {
    this.props.dispatch(example.exampleFour())
  }

  render () {
    return (
      <div>
        <div>{this.props.number}</div>
        <a onClick={this.onClickOne.bind(this)}>onClickOne</a>
        <br/>
        <a onClick={this.onClickTwo.bind(this)}>onClickTwo</a>
        <br/>
        <a onClick={this.onClickThree.bind(this)}>onClickThree</a>
        <br/>
        <a onClick={this.onClickFour.bind(this)}>onClickThree</a>
      </div>
    )
  }
}
