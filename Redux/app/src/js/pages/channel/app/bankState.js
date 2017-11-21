import React, {Component} from 'react'
import {Button} from 'antd-mobile'
import 'scss/channel/app/bank.component.scss'
import {redirect, qc} from 'utils'

export default class bankState extends Component {
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    try {
      window.postMessage(JSON.stringify({type: 'CLOSE'}))
    } catch (e) {}
  }
  next () {
    try {
      window.postMessage(JSON.stringify({type: 'VERIFY_SUCCESS', data: null}))
    } catch (e) {}
    setTimeout(() => qc.track('popWindow').catch(() => {}))
  }
  rebind () {
    let {url} = this.props.location.query
    window.location.replace(url)
  }
  render () {
    let {title, text, type, url} = this.props.location.query
    return (
      <div className='wrapper-channel-bank-state'>
        {type == 'success'
          ? <div>
            <div className='icon icon-success' />
            <div className='title'>{title || '银行卡绑卡成功'}</div>
            <Button type='ghost' size='small' inline onClick={this.next.bind(this)}>确认</Button>
          </div>
        : false}

        {type == 'fail'
          ? <div>
            <div className='icon icon-fail' />
            <div className='title'>{title || '绑卡失败'}</div>
            <div className='text'>{text || '持卡人身份信息或手机号输入不正确，请核实后重新操作'}</div>
            {url ? <Button type='primary' size='small' inline onClick={this.rebind.bind(this)}>重新绑卡</Button> : false}
          </div>
        : false}
      </div>
    )
  }
}
