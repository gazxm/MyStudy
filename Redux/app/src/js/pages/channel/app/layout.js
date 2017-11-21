import React, {Component} from 'react'
import {Modal, Toast} from 'antd-mobile'
import request from 'common/request'
import {redirect, login} from 'utils'

const RETRY_TEXT = '系统繁忙，请稍后重试'

export default class layout extends Component {
  constructor (props) {
    super(props)
    request.interceptors.response.use(response => {
      let {code, message} = response
      if (code == -2) {
        let modal = document.querySelector('.am-modal')
        if (!modal) {
          Modal.alert('提 示', message, [{
            text: '确 定',
            onPress: login
          }])
        }
        return Promise.reject(response)
      } else if (!/0|-2/.test(code) || code == -100 || code == -101) {
        return Promise.reject(response)
      }
      return Promise.resolve(response)
    })
  }
  middleware (response) {
    let {code, message = RETRY_TEXT} = response
    Toast.hide()
    if (code != -2) {
      Toast.fail(message)
      this.setState && this.setState({lock: true, loading: false})
    }
  }
  render () {
    return React.cloneElement(this.props.children, {
      middleware: this.middleware
    })
  }
};
