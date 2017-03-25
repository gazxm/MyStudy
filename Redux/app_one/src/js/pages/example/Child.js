import React from 'react'

export default class Child extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      checked: this.props.initialChecked
    }
  }

  onTextChange () {
    var newState = !this.state.checked
    this.setState({
      checked: newState
    })
    console.log(this)
    console.log(newState)
    // 这里要注意：setState 是一个异步方法，所以需要操作缓存的当前值
    this.props.callbackParent(newState)
  }

  render () {
    var text = this.props.text
    var checked = this.state.checked
    return (
      <label>{text}: <input type='checkbox' checked={checked} onChange={this.onTextChange.bind(this)} /></label>
    )
  }
}
