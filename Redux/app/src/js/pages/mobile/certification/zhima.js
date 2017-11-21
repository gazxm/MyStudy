import React, {Component} from 'react'
import {Modal} from 'antd-mobile'
import classnames from 'classnames'
import 'scss/mobile/zhima.component.scss'
import {redirect, hrefNative as native, goCertification} from 'utils'

export default class zhima extends Component {
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    let { url, success, failed } = this.props.location.query
    if (success !== undefined) {
      try {
        window.postMessage(JSON.stringify({type: 'CLOSE', data: null}))
      } catch (e) {}
      return
    } else if (failed !== undefined) {
      return
    }

    if (url) {
      setTimeout(() => {
        window.location.href = url
      }, 3000)
    } else {
      setTimeout(() => {
        Modal.alert('提示', '亲，请先填写个人信息哦~', [{
          text: '确认',
          onPress: () => {
            redirect.replace('/mobile/certification')
          }
        }])
      })
    }
  }
  home () {
    goCertification()
  }
  render () {
    let {url, success, failed} = this.props.location.query
    return (
      <div className={classnames({
        'wrapper wrapper-certification-zhima loaded': true,
        success: success !== undefined || failed !== undefined
      })}>
        {success !== undefined
          ? <div className='success'>
            <div className='logo' />
            <div className='tips'>您的芝麻信用已授权</div>
            <div className='button'>已授权</div>
            <div className='security'>银行级数据加密防护</div>
          </div>
        : false}
        {failed !== undefined
          ? <div className='failed'>
            <div className='logo' />
            <div className='tips'>授信失败</div>
            <div className='button' onClick={this.home.bind(this)}>返回首页</div>
            <div className='security'>银行级数据加密防护</div>
          </div>
        : false}
        {url
          ? <div>
            <p>请稍后</p>
            <p>正在跳转至芝麻信用</p>
          </div>
        : false}
      </div>
    )
  }
};
