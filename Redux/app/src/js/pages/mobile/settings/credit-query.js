import React, {Component} from 'react'
import {Modal, Toast} from 'antd-mobile'
import request from 'common/request'
import {hrefNative, redirect, platform, login} from 'utils'

export default class creditQuery extends Component {
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    this.query()
  }
  query () {
    Toast.loading(undefined, 0)
    function cb (response) {
      let {code, message, data} = response
      Toast.hide()
      if (code == 0) {
        data.url && (window.location.href = data.url)
        return
      }
      if (code == -1) {
        Modal.alert('提示', '请先实名认证', [{
          text: '立即认证',
          onPress: () => {
            if (platform.isApp) {
              hrefNative(3)
            } else {
              redirect.push('/mobile/certification')
            }
          }
        }])
      } else if (code == -2) {
        Modal.alert('提示', '登录态失效', [{
          text: '立即登录',
          onPress: login
        }])
      }
    }
    request('credit-check/check').then(cb.bind(this)).catch(cb.bind(this))
  }
  render () {
    return false
  }
}
