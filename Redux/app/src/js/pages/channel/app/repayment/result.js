import React, {Component} from 'react'
import {Button, Toast} from 'antd-mobile'
import classnames from 'classnames'
import request from 'common/request'
import 'scss/channel/app/repayment/result.component.scss'

const title = '结果'

export default class result extends Component {
  state = {
    loaded: false
  }
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    document.title = title
    let {middleware} = this.props
    let {query} = this.props.location
    Toast.loading(undefined, 0)
    request.post('pool/order/repayment-status', query).then(response => {
      let {title} = response.data
      Toast.hide()
      title && (document.title = title)
      this.setState({
        ...response.data,
        loaded: true
      })
    }).catch(middleware.bind(this))
  }
  render () {
    let {title, content, buttons, status, loaded} = this.state
    if(!loaded) return false
    let goto = link => {
      link && (window.location.href = link)
    }
    return (
      <div className='wrapper-channel-repayment-result'
        style={{
          height: document.documentElement.clientHeight
        }}>
          <div className={classnames({
            status: true,
            fail: status == 0,
            processing: status == 1,
            success: status == 2
          })} />
          <div className='title'>{title}</div>
          <p>{content}</p>
          {buttons && Array.isArray(buttons) ?
            buttons.map((data, index) => (
              <Button key={index} type={index ? 'ghost' : 'primary'} onClick={goto(data.link)}>{data.text}</Button>
            ))
          : false}
      </div>
    )
  }
};
