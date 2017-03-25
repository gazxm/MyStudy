import React from 'react'
import { share, partake, copy, get, login, platform, forwardApp, redirect } from 'utils'
import Toast from '../../../components/Toast'
import 'img/activity/invite/invite-12.png'

import 'scss/activity/invite.component.scss'

export default class Invite extends React.Component {
  constructor (props) {
    super(props)
    this.startTime = ''
    this.endTime = ''
    this.timeFlag = 0
    this.urlInvteCode = ''
    this.state = {
      ruleState: false,
      popupState: {
        isShow: false,
        tip: '',
        content: '',
        callback: ''
      },
      loginState: '',
      inviteCode: '',
      inviteUrl: ''
    }
  }

  componentDidMount () {
    document.title = '兼职赚钱'
    share('inviteFour')
    const query = this.props.location.query
    if (typeof query.invite_code !== 'undefined') {
      this.urlInvteCode = query.invite_code
    }
    Toast.loading('')
    get('http://credit.xianjincard.com/credit-invite/invite-four-act').then(data => data.data).then(data => {
      if (data.code === -1) {
        Toast.hide()
        this.setState({
          loginState: data.code
        })
        return
      }
      if (data.code === -11) {
        Toast.hide()
        this.setState({
          loginState: data.code
        })
        this.popupInfo('本次邀请活动3月13日10:00开启哦~', '朕知道了')
        return
      }
      if (data.code === -10) {
        Toast.hide()
        this.setState({
          loginState: data.code
        })
        this.popupInfo('本活动已结束，请关注平台其他活动~', '朕知道了')
        return
      }
      if (data.code === 1) {
        const { tag } = this.props.location.query
        const inviteUrl = `http://h.xianjincard.com/activity/invite/share?tag=${tag || ''}&invite_code=${this.urlInvteCode ? this.urlInvteCode : data.data.invite_code}`
        this.setState({
          loginState: data.code,
          inviteCode: this.urlInvteCode ? this.urlInvteCode : data.data.invite_code
        })
        get('http://credit.xianjincard.com/credit-invite/get-short-url?url=' + encodeURIComponent(inviteUrl)).then(data => data.data).then(data2 => {
          Toast.hide()
          if (data2.code === 1) {
            this.setState({
              inviteUrl: data2.data.short_url
            })
          }
        })
      } else {
        Toast.hide()
        this.popupInfo('服务器繁忙 请稍候重试', '朕知道了')
      }
    })
  }

  copyText () {
    this.startTime = (new Date().getTime() / 1000).toFixed(0)
    if (this.timeFlag) {
      return
    }
    this.timeFlag = 1
    setTimeout(() => {
      this.timeFlag = 0
      if (this.buttonBefore()) {
        const { inviteUrl } = this.state
        if (this.endTime === '') {
          copy('#贷款新口子推荐#今天发现一个新贷款口子：现金卡。最高放款5000元，首次下款速度只要5分钟，被拒还赔钱！！！口子链接>>' + inviteUrl)
          return
        }
        const time = this.endTime - this.startTime
        if (time < 0) {
          this.endTime = ''
          copy('#贷款新口子推荐#今天发现一个新贷款口子：现金卡。最高放款5000元，首次下款速度只要5分钟，被拒还赔钱！！！口子链接>>' + inviteUrl)
          return
        }
        this.endTime = ''
      }
    }, 1000)
  }

  copyEnd () {
    this.endTime = (new Date().getTime() / 1000).toFixed(0)
  }

  buttonBefore () {
    const { loginState } = this.state
    if (loginState === -1) {
      this.popupInfo('请您先登录哦~', '点击登录', login)
      return false
    }
    if (loginState === -10) {
      this.popupInfo('本活动已结束，请关注平台其他活动~', '朕知道了')
      return false
    }
    if (loginState === -11) {
      this.popupInfo('本次邀请活动3月13日10:00开启哦~', '朕知道了')
      return false
    }
    if (loginState === 1) {
      return true
    } else {
      this.popupInfo('服务器繁忙 请稍候重试', '朕知道了')
      return false
    }
  }

  invite () {
    const { tag } = this.props.location.query
    if (this.buttonBefore()) {
      if (platform.isApp) {
        const url = `http://h.xianjincard.com/activity/invite/share?tag=${tag || ''}&invite_code=${this.state.inviteCode}`
        const imgUrl = 'http://h.xianjincard.com/assets/img/activity/invite/invite-12.png'
        partake({
          'share_title': '送你一个10元现金券',
          'share_body': '通过我的邀请注册，1分钟认证，20分钟到账，被拒还有赔偿！',
          'share_url': url,
          'share_logo': imgUrl
        })
      } else {
        this.popupInfo('请下载APP再去分享哦~', '立即下载', forwardApp)
      }
    }
  }

  lookReward () {
    if (this.buttonBefore()) {
      redirect.push('/activity/invite/reward')
    }
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
    this.setState({popupState: {isShow: false}})
  }

  okPopup (e) {
    this.state.popupState.callback && this.state.popupState.callback()
    this.closePopup()
  }

  render () {
    const { ruleState, inviteUrl, popupState } = this.state

    const rule = ruleState ? <div className='rule'>
      <div className='overlay' onClick={this.closeRule.bind(this)} />
      <div className='dialog'>
        <span className='close' onClick={this.closeRule.bind(this)} />
        <h3>活动规则</h3>
        <div className='rule-content'>
          <p><b>活动时间：</b>2017年3月13日- 4月13日</p>
          <p><b>参与对象：</b>所有现金卡注册用户均可参与</p>
          <p><b>邀请人奖励：</b><br />活动期间，好友通过邀请人链接注册即为建立邀请关系，且两级好友在30天内首次申请借款，邀请人即获邀请奖励，奖励如下</p>
          <p><b>一级奖励：</b><br />邀请好友，邀请人可获得好友申请金额的1%</p>
          <p><b>二级奖励：</b><br />好友再邀请好友，邀请人可获得再邀请好友申请金额的0.1%</p>
          <p>*邀请奖励将在1个工作日内发放至邀请人“我的邀请”账户</p>
          <p>*奖励提现规则请至【我的】-【我的邀请】中查看详情</p>
          <p><b>好友奖励：</b><br />被邀请好友注册后，系统将自动发放一张10元现金券至其账户中，可至【我的】-【优惠券】中查看，现金券有效期20天，在借款时可抵扣相应现金</p>
          <p>活动期间有恶意刷奖励的用户，平台有权取消用户奖励资格</p>
          <p className='xianjincard'>本活动最终解释权归现金卡所有，与苹果公司无关</p>
        </div>
      </div>
    </div> : null

    const popup = popupState.isShow ? <div class='popup'>
      <div class='overlay' onClick={(this.closePopup.bind(this))} />
      <div class='dialog'>
        <span class='close' onClick={this.closePopup.bind(this)} />
        <p dangerouslySetInnerHTML={{__html: popupState.content}} />
        <a onClick={this.okPopup.bind(this)}>{popupState.tip}</a>
      </div>
    </div> : null

    const link = inviteUrl ? <span class='span-link'>{inviteUrl}</span> : <a className='a-link' onClick={login}>(<b>登录</b>后显示你的专属链接)</a>

    return (
      <div className='transition-group'>
        <div className='invite'>
          <h4><span>活动时间：3月13日- 4月13日</span></h4>
          <h2>有钱一起赚 收益享二级</h2>
          <div className='arrow'>
            <p className='one'><b className='a'>A</b>邀请<b className='b'>B</b>注册</p>
            <p className='two'><b className='b'>B</b>首次申请借款</p>
            <p className='three'><b className='b'>B</b>邀请<b className='c'>C</b>注册</p>
            <p className='four'><b className='c'>C</b>首次申请借款</p>
          </div>
          <p className='reward-header'><b className='a'>A</b>可获邀请奖励如下：</p>
          <div className='reward'>
            <div className='ticket clearfix'>
              <div className='left'>
                <p className='left-one'>最高</p>
                <p className='left-two'><b className='number'>50</b>元/人</p>
              </div>
              <div className='right'>
                <p>邀请一级奖励</p>
                <p><b className='a'>A</b>邀请<b className='b'>B</b>注册且<b className='b'>B</b>首次申请借款</p>
                <p><b className='a'>A</b>最低可获<b className='b'>B</b>申请金额的<b className='b'>1%</b></p>
              </div>
            </div>
            <div className='ticket clearfix'>
              <div className='left'>
                <p className='left-one'>最高</p>
                <p className='left-three'><b className='number'>5</b>元/人</p>
              </div>
              <div className='right'>
                <p>邀请二级奖励</p>
                <p><b className='b'>B</b>邀请<b className='c'>C</b>注册且<b className='c'>C</b>首次申请借款</p>
                <p><b className='a'>A</b>最低可获<b className='c'>C</b>申请金额的<b className='c'>0.1%</b></p>
              </div></div>
          </div>
          <div className='eg'>
            <h5>举个例子</h5>
            <p>A邀请B注册，B成功注册后申请借款5000元，<br />
                 则A获得奖励为50元（5000*1%）；<br />
                 B邀请C注册，C申请借款5000元， <br />
                 则A获奖励为5元（5000*0.1%），B获奖励50元（5000*1%）；<br />
                 多邀多得，上不封顶！</p>
          </div>
          <h2>被邀请人奖励</h2>
          <div class='coupon clearfix'>
            <p className='left'>
              <b className='number'>10</b>元<br />现金券
            </p>
            <p className='right'>所有被邀请人注册后，<br />即可获取10元现金券</p>
          </div>
          <h2>如何更好的邀请</h2>
          <h6>邀请小窍门：长按<b className='b'>复制下方文字</b>发帖，可以获得更多好友哦！</h6>
          <p className='link' onTouchStart={this.copyText.bind(this)} onTouchEnd={this.copyEnd.bind(this)}>#贷款新口子推荐#今天发现一个新贷款口子：现金卡。最高<br />
            放款5000元，首次下款速度只要5分钟，被拒还赔钱！！！<br />
            口子链接>> {link}</p>
        </div>
        {rule}
        {popup}
        <div className='button'>
          <a className='a-rule' onClick={this.showRule.bind(this)}>查看规则</a>
          <a className='a-invite' onClick={this.invite.bind(this)}><span>马上邀请拿现金</span></a>
          <a className='a-reward' onClick={this.lookReward.bind(this)}>我的奖励</a>
        </div>
      </div>
    )
  }
}
