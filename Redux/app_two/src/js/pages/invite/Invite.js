import React from 'react'
import { connect } from 'react-redux'

import * as inviteActions from '../../actions/inviteActions'
import 'scss/activity/invite.component.scss'
import { redirect, forwardApp, login, platform } from 'utils'
import Toast from '../../components/Toast'

import Popup from '../activity/components/Popup'
import PopupContent from './PopupContent'

@connect((store) => {
  const invite = store.invite
  return invite
})

export default class Invite extends React.Component {
  constructor (props) {
    super(props)
    this.startTime = ''
    this.endTime = ''
    this.timeFlag = 0
    this.state = {}
  }

  componentDidMount () {
    document.title = '兼职赚钱'
    this.props.dispatch(inviteActions.getInfo())
  }

  componentWillUpdate (nextProps, nextState) {
    const { fetching, dataCode } = nextProps
    fetching ? Toast.loading('') : Toast.hide()
    this.beforeButton(dataCode)
  }

  copyText () {
    this.startTime = (new Date().getTime() / 1000).toFixed(0)
    if (this.timeFlag) {
      return
    }
    this.timeFlag = 1
    setTimeout(() => {
      this.timeFlag = 0
      if (this.beforeButton(this.props.dataCode)) {
        const { inviteUrl } = this.props
        if (this.endTime === '') {
          console.log(inviteUrl)
          return
        }
        const time = this.endTime - this.startTime
        if (time < 0) {
          this.endTime = ''
          console.log(inviteUrl)
          return
        }
        this.endTime = ''
      }
    }, 1000)
  }

  copyEnd () {
    this.endTime = (new Date().getTime() / 1000).toFixed(0)
  }

  beforeButton (code) {
    switch (code) {
      case -11 : {
        Popup.alert(PopupContent.popupHtml('本次邀请活动3月13日10:00开启哦~'), 'popup')
        Popup.click('a.click', Popup.close)
        return false
      }
      case -10 : {
        Popup.alert(PopupContent.popupHtml('本活动已结束，请关注平台其他活动~'), 'popup')
        Popup.click('a.click', Popup.close)
        return false
      }
      case -1 : {
        Popup.alert(PopupContent.popupHtml('请先登录哦~', '立即登录'), 'popup')
        Popup.click('a.click', login)
        return false
      }
      case 1 : return true
      case '' : return false
      default : {
        Popup.alert(PopupContent.popupHtml(), 'popup popup-confirm')
        Popup.click('a.click', Popup.close)
        return false
      }
    }
  }

  showRule () {
    const ruleHtml = PopupContent.ruleHtml()
    Popup.alert(ruleHtml, 'rule')
  }

  invite () {
    if (this.beforeButton(this.props.dataCode)) {
      if (!platform.isApp) {
        const popupHtml = PopupContent.popupHtml('请下载APP再去分享哦~', '立即下载')
        Popup.alert(popupHtml, 'popup')
        Popup.click('a.click', forwardApp)
        return
      }
    }
  }

  lookReward () {
    if (this.beforeButton(this.props.dataCode)) {
      redirect.push('/invite/reward')
    }
  }

  render () {
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
          <p className='link'onTouchStart={this.copyText.bind(this)} onTouchEnd={this.copyEnd.bind(this)}>#贷款新口子推荐#今天发现一个新贷款口子：现金卡。最高<br />
            放款5000元，首次下款速度只要5分钟，被拒还赔钱！！！<br />
            口子链接>> {this.props.inviteUrl}</p>
        </div>
        <div className='button'>
          <a className='a-rule' onClick={this.showRule.bind(this)}>查看规则</a>
          <a className='a-invite' onClick={this.invite.bind(this)}><span>马上邀请拿现金</span></a>
          <a className='a-reward' onClick={this.lookReward.bind(this)}>我的奖励</a>
        </div>
      </div>
    )
  }
}

