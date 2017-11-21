import React from 'react'
import { DatePicker } from 'antd-mobile'
import moment from 'moment'
import {platform, login, resolveUrl, share} from 'utils'
import axios from 'axios'
import qs from 'qs'
import Toast from '../../../components/Toast'

import 'scss/activity/freetrips.component.scss'

const CustomChildren = (props) => (
  <div onClick={props.onClick} className='date-custom'>
    {props.children}
    <span className='date-span'>{props.extra}</span>
    <span class='win-list'>获奖名单</span>
  </div>
)

const maxDate = moment('2017-03-05', 'YYYY-MM-DD').utcOffset(8)
const minDate = moment('2017-02-24', 'YYYY-MM-DD').utcOffset(8)

export default class Freetrips extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loginState: 0,
      tabState: true,
      ruleState: false,
      phoneNumber: '',
      password: '',
      code: '',
      codeText: '发送验证码',
      codeDisabled: true,
      popupState: {
        isShow: false,
        tip: '',
        content: '',
        callback: ''
      },
      popupLoginState: false,
      popupRegState: false,
      popupInviteState: false,
      errorMessage: '',
      hours1: '0',
      hours2: '0',
      mins1: '0',
      mins2: '0',
      secs1: '0',
      secs2: '0',
      nowdate: '2月24日',
      nowDateTime: '2017-02-24',
      active: 0,
      rands: {
        nowTime: 0,
        endTime: 0,
        invite_count: 0,
        current_rand: 1999,
        invite_code: '',
        rands: []
      },
      rand_pass: {}
    }
  }

  componentDidMount () {
    document.title = '云南免费游'
    share('invite_tourisms')
    Toast.loading('')
    axios.get(resolveUrl('http://credit.xianjincard.com/credit-invite/get-rand')).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 1) {
        this.popupInfo('服务器繁忙，请稍候重试！')
        return
      }
      if (data.data.current_time < 1487901600) {
        this.popupInfo('活动还未开始哦！')
        this.setState({active: 1})
        return
      }
      if (data.data.current_time > 1488765600) {
        this.popupInfo('活动已经结束了，<br />请关注平台其他活动！')
        this.setState({active: 2})
      }
      let currentTime = 0
      if (data.data.current_time < 1487952000) {
        currentTime = data.data.current_time
      } else {
        currentTime = data.data.current_time - 86400
      }
      let yearToDay = new Date(currentTime * 1000).toJSON().replace(/:\d{1,2}$/, ' ').slice(0, 10)
      let toDay = yearToDay.slice(5, 10)
      let mouth = toDay.slice(0, 2)
      let day = toDay.slice(3, 5)
      if (mouth[0] === '0') {
        mouth = mouth.slice(1, 2)
      }
      if (day[0] === '0') {
        day = day.slice(1, 2)
      }
      this.setState({loginState: data.data.is_log, nowdate: `${mouth}月${day}日`, nowDateTime: yearToDay, rands: {nowTime: data.data.current_time, endTime: data.data.end_time, invite_count: data.data.invite_count, current_rand: data.data.current_rand, rands: data.data.rands}})
      axios.get(resolveUrl('http://credit.xianjincard.com/credit-invite/get-rand-pass')).then(data => data.data).then(data => {
        Toast.hide()
        if (data.code !== 1) {
          this.popupInfo('服务器繁忙，请稍候重试！')
          return
        }
        this.setState({rand_pass: data.data.rand_pass})
      })
      this.timer()
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

  timer () {
    if (this.state.active === 2) {
      return
    }
    let time = this.state.rands.endTime - this.state.rands.nowTime
    if (time === 0) {
      location.reload()
      return
    }
    let hours1 = '0'
    let hours2 = '0'
    let mins1 = '0'
    let mins2 = '0'
    let secs1 = '0'
    let secs2 = '0'
    setInterval(() => {
      if (time === 0) {
        location.reload()
        return
      }
      let hours = parseInt(time / 3600) + ''
      let mins = parseInt((time - hours * 3600) / 60) + ''
      let secs = parseInt((time - hours * 3600) % 60) + ''
      if (hours.length !== 1) {
        hours1 = hours.slice(0, 1)
        hours2 = hours.slice(1)
      } else {
        hours1 = '0'
        hours2 = hours.slice(0)
      }
      if (mins.length !== 1) {
        mins1 = mins.slice(0, 1)
        mins2 = mins.slice(1)
      } else {
        mins1 = '0'
        mins2 = mins.slice(0)
      }
      if (secs.length !== 1) {
        secs1 = secs.slice(0, 1)
        secs2 = secs.slice(1)
      } else {
        secs1 = '0'
        secs2 = secs.slice(0)
      }
      this.setState({
        hours1: hours1,
        mins1: mins1,
        secs1: secs1,
        hours2: hours2,
        mins2: mins2,
        secs2: secs2
      })
      time = time - 1
    }, 1000)
    setInterval(() => {
      Toast.loading('')
      axios.get(resolveUrl('http://credit.xianjincard.com/credit-invite/get-rand')).then(data => data.data).then(data => {
        Toast.hide()
        if (data.code !== 1) {
          this.popupInfo('服务器繁忙，请稍候重试！')
          return
        }
        this.setState({rands: {invite_count: data.data.invite_count, current_rand: data.data.current_rand, rands: data.data.rands}})
      })
    }, 300000)
  }

  tabChoose (e) {
    if (this.state.active === 1) {
      this.popupInfo('活动还未开始哦！')
      return
    }
    this.setState({
      tabState: true
    })
  }

  tabChooseTwo (e) {
    if (this.state.active === 1) {
      this.popupInfo('活动还未开始哦！')
      return
    }
    this.setState({
      tabState: false
    })
  }

  onDateChange (date) {
    this.setState({nowdate: date.format('M月D日'), nowDateTime: date.format('YYYY-MM-DD')})
  }

  showRule (e) {
    this.setState({ruleState: true})
  }

  closeRule (e) {
    this.setState({ruleState: false})
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
    this.setState({popupState: {isShow: false}, popupLoginState: false, popupRegState: false, popupInviteState: false})
  }

  okPopup (e) {
    this.state.popupState.callback && this.state.popupState.callback()
    this.closePopup()
  }

  lookReward (e) {
    if (this.state.active === 1) {
      this.popupInfo('活动还未开始哦！')
      return
    }
    if (!this.state.loginState) {
      this.popupInfo('亲，请登录后查看哦！', '马上登录', login)
      return
    }
    this.popupInfo(`亲，你已邀请<br/><span>${this.state.rands.invite_count}</span>位好友注册<br/>当前排名<span>${this.state.rands.current_rand}</span>位`)
  }

  forwardApp () {
    if (platform.isAndroid && !platform.isWeixin) {
      window.location.href = 'https://credit.xianjincard.com/download-app.html'
    } else if (platform.isIos && !platform.isWeixin) {
      window.location.href = 'https://itunes.apple.com/app/id1156410247?mt=8'
    } else {
      window.location.href = 'https://api.xianjincard.com/download-app.html'
    }
  }

  invite (e) {
    if (this.state.active === 1) {
      this.popupInfo('活动还未开始哦！')
      return
    }
    if (this.state.active === 2) {
      this.popupInfo('活动已经结束了，<br />请关注平台其他活动！')
      return
    }
    if (this.state.loginState) {
      this.popupInfo('亲，请点击右上角的分享<br />按钮进行分享哦！', '朕知道了')
      return
    }
    this.popupInfo('亲，登录之后才能分享<br />你的链接哦！', '朕知道了')
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
    this.setState({
      code: e.target.value
    })
  }

  loginTwo (e) {
    this.setState({errorMessage: ''})
    const user = {
      username: this.state.phoneNumber,
      password: this.state.password
    }
    Toast.loading('')
    axios.post(resolveUrl('http://credit.xianjincard.com/credit-user/login'), qs.stringify(user)).then(data => data.data).then(data => {
      if (data.code === -1) {
        Toast.hide()
        this.setState({errorMessage: '密码错误'})
        return
      }
      if (data.code !== 0) {
        Toast.hide()
        this.closePopup()
        this.popupInfo('服务器繁忙，请稍候再试')
        return
      }
      axios.get(resolveUrl('http://credit.xianjincard.com/credit-invite/get-user-invite-code')).then(data => data.data).then(data => {
        Toast.hide()
        if (data.code !== 1) {
          this.popupInfo('服务器繁忙，请稍候再试')
          return
        }
        this.closePopup()
        let query = this.props.location.query
        if (query.invite_code) {
          query.invite_code = data.data.invite_code
          let params = []
          for (let i in query) {
            params.push(`${i}=${query[i]}`)
          }
          let url = `${location.origin}${location.pathname}?${params.join('&')}`
          window.location.href = url
        }
      })
    })
  }

  phone (e) {
    if (this.state.active === 1) {
      this.popupInfo('活动还未开始哦！')
      return
    }
    if (!(/^1[34578]\d{9}$/.test(this.state.phoneNumber))) {
      this.popupInfo('请填写正确的手机号哦！', '朕知道了')
      return
    }
    Toast.loading('')
    this.setState({codeText: '获取验证码', codeDisabled: false})
    axios.post(resolveUrl('http://credit.xianjincard.com/credit-user/reg-get-code'), `phone=${this.state.phoneNumber}`).then(data => data.data).then(data => {
      setTimeout(() => {
        Toast.hide()
        if (data.code === 1000) {
          this.setState({popupLoginState: true})
          return
        }
        let codeTime = 60
        this.setState({popupRegState: true, codeDisabled: true, codeText: '获取验证码'})
        let codeInterval = setInterval(() => {
          if (!this.state.popupRegState) {
            clearInterval(codeInterval)
          }
          let codeText = codeTime + 's重新获取'
          this.setState({codeText: codeText})
          if (codeTime === 0) {
            this.setState({codeText: '重新获取', codeDisabled: false})
            clearInterval(codeInterval)
          }
          codeTime--
        }, 1000)
      }, 1000)
    })
  }

  register () {
    this.setState({errorMessage: ''})
    const password = '568132'
    const inviteCode = this.getUrlParam().invite_code
    const user = {
      phone: this.state.phoneNumber,
      password: password,
      code: this.state.code,
      source: 21,
      invite_code: inviteCode
    }
    Toast.loading('')
    axios.post(resolveUrl('http://credit.xianjincard.com/credit-user/register?appMarket=' + 'invite_tourisms'), qs.stringify(user)).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code === -1) {
        this.setState({errorMessage: '验证码错误'})
        return
      }
      if (data.code !== 0) {
        this.closePopup()
        this.popupInfo(data.message)
        return
      }
      axios.get(resolveUrl('http://credit.xianjincard.com/credit-invite/get-user-invite-code')).then(data => data.data).then(data => {
        Toast.hide()
        if (data.code !== 1) {
          this.popupInfo('服务器繁忙，请稍候再试')
          return
        }
        this.closePopup()
        let query = this.props.location.query
        if (query.invite_code) {
          query.invite_code = data.data.invite_code
          let params = []
          for (let i in query) {
            params.push(`${i}=${query[i]}`)
          }
          let url = `${location.origin}${location.pathname}?${params.join('&')}`
          window.location.href = url
        }
      })
    })
  }

  getCode () {
    Toast.loading('')
    axios.post(resolveUrl('http://credit.xianjincard.com/credit-user/reg-get-code'), `phone=${this.state.phoneNumber}`).then(data => data.data).then(data => {
      setTimeout(() => {
        Toast.hide()
        if (data.code === 1000) {
          this.setState({popupLoginState: true})
          return
        }
        let codeTime = 60
        this.setState({popupRegState: true, codeDisabled: true, codeText: '获取验证码'})
        let codeInterval = setInterval(() => {
          if (!this.state.popupRegState) {
            clearInterval(codeInterval)
          }
          let codeText = codeTime + 's重新获取'
          this.setState({codeText: codeText})
          if (codeTime === 0) {
            this.setState({codeText: '重新获取', codeDisabled: false})
            clearInterval(codeInterval)
          }
          codeTime--
        }, 1000)
      }, 1000)
    })
  }

  render () {
    const {hours1, mins1, secs1, hours2, mins2, secs2, tabState, loginState, ruleState, popupState, popupLoginState, popupRegState, popupInviteState, rands, rand_pass, nowDateTime} = this.state
    let rankClass = 'rank'
    let winClass = 'win'
    const randsList = rands.rands.length > 0 ? rands.rands.map((v, i) => <div class='list' key={i}><span class='ranked'>Top {i + 1}</span><span class='tel'>{v.phone}</span>已邀请{v.c}位好友注册</div>) : <div class='no-data'>暂无数据</div>
    const randsListTwo = rand_pass[nowDateTime] ? rand_pass[nowDateTime].map((v, i) => <div class='list' key={i}><span class='ranked'>Top {i + 1}</span><span class='tel'>{v.phone}</span>已邀请{v.c}位好友注册</div>) : <div class='not-data'>暂无数据</div>

    rankClass = tabState ? 'rank tab-active' : 'rank'
    winClass = tabState ? 'win' : 'win tab-active'

    const errorMessage = <div class='error'>{this.state.errorMessage}</div>

    const phoneDiv = loginState ? null : <div class='phone'><input ref='phoneInput' placeholder='请输入手机号，分享你的专属链接' value={this.state.phoneNumber} onChange={this.handleChange.bind(this)} /><button onClick={this.phone.bind(this)}>确定</button></div>

    const popup = popupState.isShow ? <div class='popup'>
      <div class='overlay' onClick={(this.closePopup.bind(this))} />
      <div class='dialog'>
        <span class='close' onClick={this.closePopup.bind(this)} />
        <p dangerouslySetInnerHTML={{__html: popupState.content}} />
        <a onClick={this.okPopup.bind(this)}>{popupState.tip}</a>
      </div>
    </div> : null

    const popupLogin = popupLoginState ? <div class='popup'>
      <div class='overlay' />
      <div class='dialog'>
        <span class='close' onClick={this.closePopup.bind(this)} />
        <p>亲，请登录后查看哦！</p>
        <div class='password'><input type='password' ref='passwordInput' placeholder='请输入登录密码' value={this.state.password} onChange={this.handleChangeTwo.bind(this)} /><a class='input-a' onClick={this.loginTwo.bind(this)}>登录</a></div>
        {errorMessage}
      </div>
    </div> : null

    const popupReg = popupRegState ? <div class='popup'>
      <div class='overlay' />
      <div class='dialog'>
        <span class='close' onClick={this.closePopup.bind(this)} />
        <p>亲，请输入验证码后查看哦！</p>
        <div class='password'><input class='input-code' ref='codeInput' placeholder='请输入验证码' value={this.state.code} onChange={this.handleChangeThree.bind(this)} /><button disabled={this.state.codeDisabled} className={this.state.codeDisabled ? 'a-code disabled' : 'a-code'} onClick={this.getCode.bind(this)}>{this.state.codeText}</button></div>
        {errorMessage}
        <a class='register' onClick={this.register.bind(this)}>注册</a>
      </div>
    </div> : null

    const popupInvite = popupInviteState ? <div class='popup'>
      <div class='overlay' />
      <div class='share' onClick={this.closePopup.bind(this)} />
    </div> : null

    const rule = ruleState ? <div class='rule'>
      <div class='overlay' onClick={this.closeRule.bind(this)} />
      <div class='dialog'>
        <span class='close' onClick={this.closeRule.bind(this)} />
        <h3>活动规则</h3>
        <div class='rule-content'>
          <p>● 活动时间：2017年2月24日10点——3月6日10点</p>
          <p>● 奖励规则：</p>
          <p class='green'>1）根据活动期间新邀请好友注册数进行排名</p>
          <p class='green'>2）排名每天10点开始，次日10点截止</p>
          <p class='green'>3）截止时间前排行前十用户即获免费游大奖，邀请人数相同根据时间先后排名</p>
          <p class='green'>4）所有用户当日所邀请好友数次日清零，重新计算</p>
          <p>● 如何查看我的排名：<br />点击屏幕上“我的排名”圆框，即可查看当前我的邀请人数和排名</p>
          <p>● 奖励发放：中奖信息会以短信的形式发放至您注册的手机号，依据短信内容领取双人免费游机会，该机会可以转赠，不可抵现，请提前7天预约，有效期至2017年6月30号前</p>
          <p>● 如发现机器作弊等违反诚实守信原则的行为，现金卡有权取消中奖资格</p>
          <p>● 本活动与平台“人脉总动员，开心赚大钱”活动奖励同享。如有问题，请联系“现金美眉”微信号：XJC-MM</p>
          <p>● 本活动最终解释权归现金卡所有，与房多多和Apple.Inc无关</p>
        </div>
      </div>
    </div> : null

    return (
      <div>
        <div class='transition-group'>
          <div class='freetrips'>
            <div class='time'>
              <p>距免费游云南名额放送时间剩</p>
              <div><span>{hours1}</span><span>{hours2}</span><b>:</b><span>{mins1}</span><span>{mins2}</span><b>:</b><span>{secs1}</span><span>{secs2}</span></div>
            </div>
            {phoneDiv}
            <div class='ticket'><i /></div>
            <div className='all-content all-active'>
              <div class='tab'>
                <div className={rankClass} onClick={this.tabChoose.bind(this)}>
                  查看当下排行榜
                </div>
                <div className={winClass} onClick={this.tabChooseTwo.bind(this)}>
                  查看中奖名单
                </div>
              </div>
              <div className='content content-active'>
                <div className={tabState ? 'rank active' : 'rank'}>
                  <div class='list-content'>
                    {randsList}
                  </div>
                </div>
                <div className={tabState ? 'win' : 'win active'}>
                  <div className='date-picker'>
                    <DatePicker mode='date' title='选择日期' minDate={minDate} maxDate={maxDate} extra={this.state.nowdate} value={this.state.date} onChange={this.onDateChange.bind(this)}>
                      <CustomChildren />
                    </DatePicker>
                  </div>
                  <div class='list-content'>
                    {randsListTwo}
                  </div>
                </div>
              </div>
            </div>
            <p class='play'>如何中奖：<br />每天10点开始，次日10点揭榜。期间根据用户新邀请好友<br />数进行排名，进入榜单用户即获免费云南游！</p>
            <div class='code'>
              <i class='mm' />
              <i class='gg' />
            </div>
          </div>
        </div>
        <div class='lookReward' onClick={this.lookReward.bind(this)}>
          我的<br />排名
        </div>
        <div class='fixed'>
          <div class='rule' onClick={this.showRule.bind(this)}>活动<br />规则</div>
          <div class='invite' onClick={this.invite.bind(this)}>邀请好友免费游云南</div>
        </div>
        {rule}
        {popup}
        {popupLogin}
        {popupReg}
        {popupInvite}
      </div>
    )
  }
}
