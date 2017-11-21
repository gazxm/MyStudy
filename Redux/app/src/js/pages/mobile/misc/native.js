import React, {Component} from 'react'
import {Button} from 'antd-mobile'

export default class native extends Component {
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    try {
      window.postMessage(JSON.stringify({type: 'CLOSE'}))
    } catch (e) {}
  }
  next () {
    let {type = 1} = this.props.location.query
    window.location.href = `/mobile/misc/native?type=${Number(type) + 1}`
  }
  render () {
    let {type = 1} = this.props.location.query
    return (
      <div className='wrapper loaded'>
        {type}
        <Button type='pirmary' onClick={this.next.bind(this)}>下一页</Button>
      </div>
    )
  }
};
