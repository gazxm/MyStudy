import React from 'react'
import Toast from '../../../components/Toast'
import Popup from '../components/Popup'
import Content from './Content'
import { post } from 'utils'

export default class Input extends React.Component {
  constructor (props) {
    super(props)
    this.timeout = ''
    this.codeFlag = 1
    this.state = {
      codeText: '获取验证码',
      phoneNumber: '',
      password: '',
      code: ''
    }
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
      Popup.alert(Content.popupHtml('手机号不能为空哦~'), 'popup')
      Popup.click('a.click')
      return false
    }
    if (!reg.test(phone)) {
      Popup.alert(Content.popupHtml('请输入正确的手机号哦~'), 'popup')
      Popup.click('a.click')
      return false
    }
    return true
  }

  verfiy (phoneNumber, password, code) {
    if (this.verifyPhone(phoneNumber)) {
      if (password === '') {
        Popup.alert(Content.popupHtml('请设置你的登录密码哦~'), 'popup')
        Popup.click('a.click')
        return false
      }
      if (password.length < 6) {
        Popup.alert(Content.popupHtml('密码不能小于6位哦~'), 'popup')
        Popup.click('a.click')
        return false
      }
      if (code === '') {
        Popup.alert(Content.popupHtml('请输入验证码哦~'), 'popup')
        Popup.click('a.click')
        return false
      }
    } else {
      return false
    }
    return true
  }

  getCode () {
    const phone = this.state.phoneNumber
    if (this.verifyPhone(phone) && this.codeFlag) {
      Toast.loading('')
      post('http://credit.xianjincard.com/credit-user/reg-get-code', {phone: phone}).then(data => data.data).then(data => {
        Toast.hide()
        if (data.code === 0) {
          this.setCodeText(60)
          return
        }
        Popup.alert(Content.popupHtml(''), 'popup')
        Popup.click('a.click')
      })
    }
  }

  setCodeText (number, l) {
    this.timeout = setTimeout(() => {
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

  receive () {
    const { share } = this.props
    console.log(share)
    if (!this.state.inputFlag) {
      const { phoneNumber } = this.state
      if (this.verifyPhone(this.state.phoneNumber)) {
        const params = {
          phone: phoneNumber
        }
        Toast.loading('')
        post('http://credit.xianjincard.com/act/check-user', params).then(data => data.data).then(data => {
          Toast.hide()
          if (data.code === 0) {
            if (data.data.is_new) {
              share.setState({
                inputFlag: true
              })
              return
            }
            share.setState({
              contentFlag: false,
              inputFlag: false,
              phoneNumber: phoneNumber,
              is_new: 0
            })
          } else {
            const message = data.message ? data.message : '服务器繁忙，请稍候重试'
            Popup.alert(Content.popupHtml(`${message}`), 'popup')
            Popup.click('a.click')
          }
        })
      }
    } else {
      const { phoneNumber, password, code } = this.state
      if (this.verfiy(phoneNumber, password, code)) {
        Toast.loading('')
        post(`http://credit.xianjincard.com/credit-user/register`, {phone: phoneNumber, password: password, code: code, source: 21}).then(data => data.data).then(data => {
          Toast.hide()
          if (data.code === 0) {
            this.codeFlag = 1
            clearTimeout(this.timeout)
            this.setState({
              codeText: '获取验证码',
              phoneNumber: '',
              password: '',
              code: ''
            })
            share.setState({
              contentFlag: false,
              inputFlag: false,
              phoneNumber: phoneNumber,
              is_new: 1
            })
          } else {
            const message = data.message ? data.message : '服务器繁忙，请稍候重试'
            Popup.alert(Content.popupHtml(`${message}`), 'popup')
            Popup.click('a.click')
          }
        })
      }
    }
  }

  render () {
    const { inputFlag, codeText } = this.state

    const input = inputFlag ? <div><input className='password' type='password' placeholder='设置登录密码' value={this.state.password} onChange={this.handleChangeTwo.bind(this)} />
      <p className='special clearfix'>
        <input className='code' type='text' placeholder='输入验证码' value={this.state.code} onChange={this.handleChangeThree.bind(this)} />
        <a className='a-code' onClick={this.getCode.bind(this)}>{codeText}</a>
      </p></div> : null

    return (
      <div className='receive-content'>
        <i className='red' />
        <p>请下载APP登录后方可使用红包</p>
        <input className='phone' ref='phoneInput' type='text' placeholder='请输入手机号' value={this.state.phoneNumber} onChange={this.handleChange.bind(this)} />
        {input}
        <a className='a-receive' onClick={this.receive.bind(this)}>立即领取</a>
      </div>
    )
  }
}
