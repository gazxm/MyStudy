import React, {Component} from 'react'
import qc from 'common/qiancheng'
import request from 'common/request'
import {Toast} from 'antd-mobile'
import {resolveUrl, redirect, login} from 'utils'

export default class index extends Component {
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    let {url} = this.props.location.query
    // credit-user/quick-login
    qc.track('getSessionID').then(response => {
      let {sessionid} = response.data

      if (sessionid) {
        request.post('credit-user/quick-login', {
          SESSIONID: sessionid
        }).then(response => {
          let {code, message, data = {}} = response
          let {item} = data
          if (code == 0) {
            // if (item && item.sessionid) {
            //   document.cookie = `SESSIONID=;path=/;domain=.xianjincard.com;`
            //   document.cookie = `SESSIONID=${item.sessionid};path=/;domain=.xianjincard.com;`
            // }
            if (url) {
              window.location.href = url
            } else {
              redirect.goBack()
            }
          } else {
            this.login()
          }
        }).catch(response => {
          let {message} = response
          Toast.fail(message, () => {
            redirect.goBack()
          })
        })
      } else {
        this.login()
      }
    }).catch(response => {
      let {code} = response
      if (code == 1002) {
        redirect.goBack()
      } else {
        this.login()
      }
    })
  }
  login () {
    qc.track('jump', {url: 'koudaikj://app.launch/login/applogin'})
  }
  render () {
    return false
  }
}
