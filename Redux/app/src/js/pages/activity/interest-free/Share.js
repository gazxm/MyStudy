import React from 'react'
import { share, post, redirect } from 'utils'
import Toast from '../../../components/Toast'
import Download from '../components/DownloadPopup'
import Popup from '../components/Popup'

import 'scss/activity/interest-free.component.scss'

export default class Share extends React.Component {
  constructor (props) {
    super(props)
    this.codeFlag = 1
    this.state = {
      phoneNumber: '',
      password: '',
      code: '',
      codeText: '获取验证码',
      popupState: {
        isShow: false,
        tip: '',
        content: '',
        callback: ''
      }
    }
  }

  componentDidMount () {
    document.title = '免息狂欢日'
    share('khr')
    document.getElementById('checkbox').checked = true
  }

  popupHtml (content = '服务器繁忙 请稍后重试', tips = '朕知道了') {
    return `<p>${content}</p><a class='click'>${tips}</a>`
  }

  regProtocol () {
    location.href = 'https://api.xianjincard.com/act/protocol'
  }

  handleChange (e) {
    if (e.target.value.length > 11) {
      return
    }
    this.setState({
      phoneNumber: e.target.value
    })
  }

  handleChangeTwo (e) {
    this.setState({
      password: e.target.value
    })
  }

  handleChangeThree (e) {
    if (e.target.value.length > 6) {
      return
    }
    this.setState({
      code: e.target.value
    })
  }

  verifyPhone (phone) {
    const reg = /^1(3|4|5|7|8)\d{9}$/
    if (phone === '') {
      Popup.alert(this.popupHtml(`手机号不能为空哦~`), 'popup')
      Popup.click('a.click')
      return false
    }
    if (!reg.test(phone)) {
      Popup.alert(this.popupHtml(`请输入正确的手机号哦~`), 'popup')
      Popup.click('a.click')
      return false
    }
    return true
  }

  verfiy () {
    const { phoneNumber, password, code } = this.state
    if (this.verifyPhone(phoneNumber)) {
      if (password === '') {
        Popup.alert(this.popupHtml(`请设置你的登录密码哦~`), 'popup')
        Popup.click('a.click')
        return false
      }
      if (password.length < 6) {
        Popup.alert(this.popupHtml(`密码不能小于6位哦~`), 'popup')
        Popup.click('a.click')
        return false
      }
      if (code === '') {
        Popup.alert(this.popupHtml(`请输入验证码哦~`), 'popup')
        Popup.click('a.click')
        return false
      }
      if (!document.getElementById('checkbox').checked) {
        Popup.alert(this.popupHtml(`请阅读并同意《现金白卡使用协议》哦~`), 'popup')
        Popup.click('a.click')
        return false
      }
    } else {
      return false
    }
    return true
  }

  forward () {
    redirect.push('/activity/interest-free')
  }

  getCode () {
    const phone = this.state.phoneNumber
    if (this.verifyPhone(phone) && this.codeFlag) {
      Toast.loading('')
      post('http://api.xianjincard.com/user/reg-get-code', {phone: phone}).then(data => data.data).then(data => {
        Toast.hide()
        if (data.code === 1000) {
          Popup.alert(this.popupHtml(`你已经注册过了哦~`, `立即申请`), 'popup')
          Popup.click('a.click', this.forward)
          return
        }
        if (data.code === 0) {
          this.setCodeText(60)
          return
        }
        Popup.alert(this.popupHtml(`服务器繁忙 请稍候重试`), 'popup')
        Popup.click('a.click')
      })
    }
  }

  setCodeText (number, l) {
    setTimeout(() => {
      let codeText = number + '秒后重试'
      this.setState({
        codeText: codeText
      })
      if (number) {
        this.codeFlag = 0
        this.setCodeText(--number, 1000)
      } else {
        this.codeFlag = 1
        this.setState({
          codeText: '重新发送'
        })
      }
    }, l)
  }

  reg () {
    if (this.verfiy()) {
      const { phoneNumber, password, code } = this.state
      const activityId = 'interestFree'
      Toast.loading('')
      post(`http://credit.xianjincard.com/credit-user/register?appMarket=${activityId}`, {phone: phoneNumber, password: password, code: code, source: 21}).then(data => data.data).then(data => {
        Toast.hide()
        if (data.code === 0) {
          Popup.alert(this.popupHtml(`您已经成功注册了哦~`, `立即申请`), 'popup')
          Popup.click('a.click', this.forward)
        } else {
          const message = data.message ? data.message : '服务器繁忙，请稍候重试'
          Popup.alert(this.popupHtml(`${message}`), 'popup')
          Popup.click('a.click')
        }
      })
    }
  }

  render () {
    const { codeText } = this.state

    return (
      <div className='transition-group'>
        <div className='share'>
          <p><input ref='phoneInput' className='tel' id='phone' type='text' value={this.state.phoneNumber} placeholder='请输入手机号' onChange={this.handleChange.bind(this)} /></p>
          <p><input className='password' id='password' type='password' value={this.state.password} placeholder='请设置登录密码' onChange={this.handleChangeTwo.bind(this)} /></p>
          <p className='special clearfix'>
            <input className='code' id='code' type='text' value={this.state.code} placeholder='清输入短信验证码' onChange={this.handleChangeThree.bind(this)} />
            <a onClick={this.getCode.bind(this)}>{codeText}</a>
          </p>
          <a className='reg' onClick={this.reg.bind(this)}><span>立即注册</span></a>
          <p className='clearfix other'>
            <input id='checkbox' type='checkbox' value='' style={{display: 'none'}} />
            <label for='checkbox'>我已阅读并同意<a onClick={this.regProtocol.bind(this)}>《现金白卡使用协议》</a><i /></label>
          </p>
          <p className='company'>投资有风险 入市需谨慎<br />上海浅橙网络科技有限公司 沪ICP备16040623号</p>
        </div>
        <Download />
      </div>
    )
  }
}
