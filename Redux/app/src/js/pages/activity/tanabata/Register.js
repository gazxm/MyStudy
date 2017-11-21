import React from 'react'
import Content from './Content'
import Effect from './Effect'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { post, resolveUrl, login, redirect } from 'utils'
import 'scss/activity/tanabata.component.scss'

export default class Register extends React.Component {
  constructor (props) {
    super(props)
    this.codeFlag = 1
    this.state = {
      phoneNumber: '',
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
    document.title = '我的心里“指”有你'
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
      Toast.info(`手机号不能为空哦~`, 2)
      return false
    }
    if (!reg.test(phone)) {
      Toast.info(`请输入正确的手机号哦~`, 2)
      return false
    }
    return true
  }

  verfiy () {
    const { phoneNumber, code } = this.state
    if (this.verifyPhone(phoneNumber)) {
      if (code === '') {
        Toast.info(`请输入验证码哦~`, 2)
        return false
      }
      if (!document.getElementById('checkbox').checked) {
        Toast.info(`请阅读并同意《现金白卡使用协议》哦~`, 2)
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
          Toast.info(`你已经注册过了哦`, 2)
          return
        }
        if (data.code === 0) {
          this.setCodeText(60)
          return
        }
        Toast.info(`服务器繁忙 请稍候重试`, 2)
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
      const { phoneNumber, code } = this.state
      const activityId = 'tanabata'
      Toast.loading('')
      post(`http://credit.xianjincard.com/activity/default/register?appMarket=${activityId}`, {phone: phoneNumber, code: code, source: 21}).then(data => data.data).then(data => {
        Toast.hide()
        if (data.code === 0) {
          Toast.info(`您已经成功注册了哦`, 2)
          const hrefUrl = window.sessionStorage && window.sessionStorage.getItem('tanabataHref')
          location.href = hrefUrl
        } else {
          const message = data.message ? data.message : '服务器繁忙，请稍候重试'
          Toast.info(`${message}`, 2)
        }
      })
    }
  }

  forwordLogin () {
    const hrefUrl = window.sessionStorage && window.sessionStorage.getItem('tanabataHref')
    login(null, null, hrefUrl)
  }

  render () {
    const { codeText } = this.state
    return (
      <div className='transition-group'>
        <div className='tanabata login'>
          <Effect />
          <span className='tit' />
          <div className='form'>

            <h3>填写手机号记录指纹</h3>
            <p><input ref='phoneInput' className='tel' id='phone' type='text' value={this.state.phoneNumber} placeholder='请输入手机号' onChange={this.handleChange.bind(this)} /></p>
            <p className='special clearfix'>
              <input className='code' id='code' type='text' value={this.state.code} placeholder='清输入短信验证码' onChange={this.handleChangeThree.bind(this)} />
              <a onClick={this.getCode.bind(this)}>{codeText}</a>
            </p>
            <p className='clearfix other'>
              <input id='checkbox' type='checkbox' value='' />
              <label for='checkbox'>我已阅读并同意<a onClick={this.regProtocol.bind(this)}>《现金白卡使用协议》</a><i /></label>
            </p>
            <a className='reg' onClick={this.reg.bind(this)}><span>查看所有</span></a>
            <p className='other'>已有帐号? <a onClick={() => { this.forwordLogin() }}>立即登录</a></p>
          </div>
        </div>
      </div>
    )
  }
}
