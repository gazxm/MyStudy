import React from 'react'
import { get, post, resolveUrl, forwardApp, share } from 'utils'
import Toast from '../../../components/Toast'
import Popup from '../components/Popup'
import Content from './Content'
import 'img/activity/share/share-12.png'
import 'scss/activity/share.component.scss'

export default class Share extends React.Component {
  constructor (props) {
    super(props)
    this.sign = ''
    this.timeout = ''
    this.codeFlag = 1
    this.state = {
      contentFlag: false,
      inputFlag: false,
      ticketFlag: false,
      phoneNumber: '',
      password: '',
      code: '',
      codeText: '获取验证码',
      invite_code: '',
      infoData: {
        amount: 0,
        expire_date: '',
        tel: ''
      }
    }
  }

  componentDidMount () {
    document.title = '分享红包'
    const query = this.props.location.query
    this.sign = query.sign
    share('share')
    Toast.loading('')
    get('http://credit.xianjincard.com/act/red-pack-act').then(data => data.data).then(data => {
      if (data.code === -1001) {
        Toast.hide()
        location.href = resolveUrl('http://credit.xianjincard.com/wx/user-auth-template?redirectUrl=' + encodeURIComponent(location.href))
        return
      }
      if (data.code === 0) {
        if (data.data) {
          const params = {
            phone: data.data,
            sign: this.sign,
            is_new: 0
          }
          post('http://credit.xianjincard.com/act/get-red-pack', params).then(data => data.data).then(data2 => {
            Toast.hide()
            this.setInfoData(data2, data.data)
            this.setState({
              invite_code: (typeof data2.data.invite_code !== 'undefined') ? data2.data.invite_code : ''
            })
          })
          return
        }
        Toast.hide()
        this.setState({
          contentFlag: true
        })
      } else {
        Toast.hide()
        const message = data.message ? data.message : '服务器繁忙，请稍候重试'
        Popup.alert(Content.popupHtml(`${message}`), 'popup')
        Popup.click('a.click')
      }
    })
  }

  receive () {
    if (!this.state.inputFlag) {
      const { phoneNumber } = this.state
      if (this.verifyPhone(phoneNumber)) {
        const params = {
          phone: phoneNumber
        }
        Toast.loading('')
        post('http://credit.xianjincard.com/act/check-user', params).then(data => data.data).then(data => {
          if (data.code === 0) {
            if (data.data.is_new) {
              Toast.hide()
              this.setState({
                inputFlag: true
              })
              return
            }
            const paramsTwo = {
              phone: phoneNumber,
              sign: this.sign,
              is_new: 0
            }
            post('http://credit.xianjincard.com/act/get-red-pack', paramsTwo).then(data => data.data).then(data2 => {
              Toast.hide()
              this.setInfoData(data2, phoneNumber)
              this.setState({
                phoneNumber: '',
                invite_code: (typeof data2.data.invite_code !== 'undefined') ? data2.data.invite_code : ''
              })
            })
          } else {
            Toast.hide()
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
        const activityId = 'ShareRed'
        post(`http://credit.xianjincard.com/credit-user/register?appMarket=${activityId}`, {phone: phoneNumber, password: password, code: code, source: 21}).then(data => data.data).then(data => {
          if (data.code === 0) {
            Toast.hide()
            const params = {
              phone: phoneNumber,
              sign: this.sign,
              is_new: 1
            }
            post('http://credit.xianjincard.com/act/get-red-pack', params).then(data => data.data).then(data2 => {
              Toast.hide()
              this.codeFlag = 1
              clearTimeout(this.timeout)
              this.setInfoData(data2, phoneNumber)
              this.setState({
                codeText: '获取验证码',
                phoneNumber: '',
                password: '',
                code: '',
                invite_code: (typeof data2.data.invite_code !== 'undefined') ? data2.data.invite_code : ''
              })
            })
          } else {
            Toast.hide()
            const message = data.message ? data.message : '服务器繁忙，请稍候重试'
            Popup.alert(Content.popupHtml(`${message}`), 'popup')
            Popup.click('a.click')
          }
        })
      }
    }
  }

  setInfoData (data2, phone) {
    if (data2.code === -1004 || data2.code === -1002) {
      this.setState({
        contentFlag: true,
        inputFlag: false
      })
      return
    }
    if (data2.code === -2010) {
      this.setState({
        infoData: {
          amount: data2.data.amount,
          expire_date: data2.data.expire_date,
          tel: phone
        },
        contentFlag: false,
        ticketFlag: true
      })
      Toast.info('你已领取过该红包哦~', 2)
      return
    }
    if (data2.code === 0) {
      this.setState({
        infoData: {
          amount: data2.data.amount,
          expire_date: data2.data.expire_date,
          tel: phone
        },
        contentFlag: false,
        ticketFlag: true
      })
      return
    }
    const ticketHtml = Content.ticketNodata(data2.code)
    this.setState({
      contentFlag: false,
      ticketFlag: false,
      ticketHtml: ticketHtml
    })
    return
  }

  handleChange (e) {
    if (e.target.value.length < 11) {
      this.setState({
        inputFlag: false
      })
    }
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

  changePhone () {
    this.setState({
      contentFlag: true,
      inputFlag: false
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
      post('http://api.xianjincard.com/user/reg-get-code', {phone: phone}).then(data => data.data).then(data => {
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

  invite () {
    const inviteUrl = `${location.protocol}//${location.host}/activity/invite?invite_code=${this.state.invite_code}`
    location.href = inviteUrl
  }

  render () {
    const { contentFlag, inputFlag, codeText, ticketFlag, ticketHtml, infoData } = this.state

    const input = inputFlag ? <div><input className='password' type='password' placeholder='设置登录密码' value={this.state.password} onChange={this.handleChangeTwo.bind(this)} />
      <p className='special clearfix'>
        <input className='code' type='text' placeholder='输入验证码' value={this.state.code} onChange={this.handleChangeThree.bind(this)} />
        <a className='a-code' onClick={this.getCode.bind(this)}>{codeText}</a>
      </p></div> : null

    const ticketContent = ticketFlag ? <div className='ticket clearfix'>
      <div className='left'>
        <p><b>{infoData.amount}</b>元</p>
        <p>分享红包抵扣券</p>
      </div>
      <div className='right'>
        <p>限借款金额：满<b>1000</b>元</p>
        <p>限借款期限: <b>14</b>天以上</p>
        <p>有效期至: {infoData.expire_date}</p>
      </div>
      <p className='account'>红包已发放至账户
      <a onClick={this.changePhone.bind(this)}>{infoData.tel} 修改></a></p>
    </div> : <div className='ticket no-data' dangerouslySetInnerHTML={{__html: ticketHtml}} />

    const content = contentFlag ? <div className='receive-content'>
      <i className='red' />
      <p>请下载APP登录后方可使用红包</p>
      <input className='phone' ref='phoneInput' type='text' placeholder='请输入手机号' value={this.state.phoneNumber} onChange={this.handleChange.bind(this)} />
      {input}
      <a className='a-receive' onClick={this.receive.bind(this)}>立即领取</a>
    </div> : <div className='ticket-content'>
      {ticketContent}
      <a className='use' onClick={forwardApp}>立即使用</a>
      <a className='invite' onClick={this.invite.bind(this)}>邀请好友送红包，奖励停不下来</a>
    </div>

    return (
      <div className='transition-group'>
        <div className='share'>
          <div className='content'>
            {content}
          </div>
          <div className='rule'>
            <h3>活动细则</h3>
            <p>1、红包新老用户同享</p>
            <p>2、红包与平台其他活动优惠可同享</p>
            <p>3、每人每天只有三次抢红包机会</p>
            <p>4、领取红包的手机号必须与使用账户优惠券的手机号一致</p>
            <p>5、发放至手机号的红包需在app用手机号注册，登录后方能使用</p>
            <p>6、现金卡保留法律允许范围内的对活动的解释权</p>
          </div>
        </div>
      </div>
    )
  }
}
