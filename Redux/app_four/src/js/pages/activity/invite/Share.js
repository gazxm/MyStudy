import React from 'react'
import { share, post, goHome, get, redirect } from 'utils'
import Toast from '../../../components/Toast'
import Download from '../components/DownloadPopup'
import 'scss/activity/invite.component.scss'

export default class Share extends React.Component {
  constructor (props) {
    super(props)
    this.codeFlag = 1
    this.state = {
      inviteTel: '',
      popupFlag: false,
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
    document.title = '兼职赚钱'
    share('inviteFour')
    document.getElementById('checkbox').checked = true
    const inviteCode = encodeURIComponent(this.getUrlParam().invite_code)
    Toast.loading('')
    get(`http://credit.xianjincard.com/credit-invite/get-user-info?invite_code=${inviteCode}`).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 1) {
        this.popupInfo(data.message, '朕知道了')
        return
      }
      this.setState({
        inviteTel: data.data.phone
      })
    })
  }

  getUrlParam () {
    let requestParameters = {}

    let url = window.location.href
    let urlArr = url.split('?')
    if (urlArr[1]) {
      let urlParameters = urlArr[1].split('#')[0]
      if (urlParameters.indexOf('?') === -1) {
        let parameters = decodeURI(urlParameters)
        let parameterArray = parameters.split('&')
        for (var i = 0; i < parameterArray.length; i++) {
          requestParameters[parameterArray[i].split('=')[0]] = (parameterArray[i].split('=')[1])
        }
      }
    }
    return requestParameters
  }

  popupInfo (content, tip, callback) {
    this.setState({
      popupState: {
        isShow: true,
        content,
        tip,
        callback
      }
    })
  }

  closePopup (e) {
    this.setState({popupState: {isShow: false}})
  }

  okPopup (e) {
    this.state.popupState.callback && this.state.popupState.callback()
    this.closePopup()
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
      this.popupInfo('手机号不能为空哦~', '朕知道了')
      return false
    }
    if (!reg.test(phone)) {
      this.popupInfo('请输入正确的手机号哦~', '朕知道了')
      return false
    }
    return true
  }

  verfiy () {
    const { phoneNumber, password, code } = this.state
    if (this.verifyPhone(phoneNumber)) {
      if (password === '') {
        this.popupInfo('请设置你的登录密码哦~', '朕知道了')
        return false
      }
      if (password.length < 6) {
        this.popupInfo('密码不能小于6位哦~', '朕知道了')
        return false
      }
      if (code === '') {
        this.popupInfo('请输入验证码哦~', '朕知道了')
        return false
      }
      if (!document.getElementById('checkbox').checked) {
        this.popupInfo('请阅读并同意《现金白卡使用协议》哦~', '朕知道了')
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
        if (data.code === 1000) {
          this.popupInfo('你已经注册过了哦~', '马上借款', goHome)
          this.setState({
            popupFlag: true
          })
          return
        }
        if (data.code === 0) {
          this.setCodeText(60)
          return
        }
        this.popupInfo('服务器繁忙 请稍候重试', '朕知道了')
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
      const query = this.props.location.query
      const activityId = query.tag || ''
      Toast.loading('')
      post(`http://credit.xianjincard.com/credit-user/register?appMarket=${activityId}`, {phone: phoneNumber, password: password, code: code, source: 21, invite_code: encodeURIComponent(this.getUrlParam().invite_code)}).then(data => data.data).then(data => {
        Toast.hide()
        if (data.code === 0) {
          this.popupInfo('恭喜您！<br />成功注册现金白卡', '马上借款', goHome)
          this.setState({
            popupFlag: true
          })
        } else {
          const message = data.message ? data.message : '服务器繁忙，请稍候重试'
          this.popupInfo(`${message}`, '朕知道了')
        }
      })
    }
  }

  makeMoney () {
    redirect.push('/activity/invite')
  }

  render () {
    const { popupState, codeText, inviteTel, popupFlag } = this.state

    const popup = popupState.isShow ? <div class='popup popup-share'>
      <div class='overlay' onClick={(this.closePopup.bind(this))} />
      <div class='dialog'>
        <span class='close' onClick={this.closePopup.bind(this)} />
        <p className={`${popupFlag ? '' : 'p-error'}`} dangerouslySetInnerHTML={{__html: popupState.content}} />
        <a className={`a-button ${popupFlag ? '' : 'a-error'}`} onClick={this.okPopup.bind(this)}>{popupState.tip}</a>
        {popupFlag ? <a className='make-money' onClick={this.makeMoney.bind(this)}>邀请去赚钱</a> : null}
      </div>
    </div> : null

    return (
      <div className='transition-group'>
        <div className='share'>
          <p className='yf'>你的好友<b>{inviteTel}</b><br />送你一个现金大礼包</p>
          <p><input ref='phoneInput' className='tel' id='phone' type='text' value={this.state.phoneNumber} placeholder='请输入手机号' onChange={this.handleChange.bind(this)} /></p>
          <p><input className='password' id='password' type='password' value={this.state.password} placeholder='请设置登录密码' onChange={this.handleChangeTwo.bind(this)} /></p>
          <p className='special clearfix'>
            <input className='code' id='code' type='text' value={this.state.code} placeholder='请输入验证码' onChange={this.handleChangeThree.bind(this)} />
            <a onClick={this.getCode.bind(this)}>{codeText}</a>
          </p>
          <p className='clearfix other'>
            <input id='checkbox' type='checkbox' value='' style={{display: 'none'}} />
            <label for='checkbox'>我已阅读并同意<a onClick={this.regProtocol.bind(this)}>《现金白卡使用协议》</a><i /></label>
          </p>
          <a className='reg' onClick={this.reg.bind(this)}><span>马上领钱</span></a>
          <p className='company'>投资有风险 入市需谨慎<br />上海浅橙网络科技有限公司<br />沪ICP备16040623号</p>
        </div>
        {popup}
        <Download />
      </div>
    )
  }
}
