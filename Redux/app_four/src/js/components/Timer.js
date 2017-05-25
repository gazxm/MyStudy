import React from 'react'
import classNames from 'classnames'
export default class Timer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: this.props.title,
      isClick: true
    }
  }
  interval (seconds) {
    let oldTitle = this.state.title
    this.setState({isClick: false})
    var interval = () => {
      this.setState({title: seconds})
      if (seconds === 0) {
        this.setState({title: oldTitle, isClick: true})
        return
      }
      // console.log(seconds)
      seconds--
      setTimeout(interval, this.props.interval)
    }
    return interval
  }
  onSend (e) {
    e.preventDefault()
    if (this.props.disabled) {
      return
    }
    if (!this.state.isClick) {
      return
    }
    this.props.onSend && this.props.onSend()
    this.interval(this.props.total)()
  }
  render () {
    const { className } = this.props
    return <a class={className + ' ' + classNames({disabled: this.props.disabled})} href="" onClick={this.onSend.bind(this)}>{this.state.title}</a>
  }
}

Timer.defaultProps = {
  title: '点击获取',
  interval: 1000,
  total: 60,
  disabled: false
}
