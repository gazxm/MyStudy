import React from 'react'
import { connect } from 'react-redux'
import { Tabs, WhiteSpace } from 'antd-mobile'
import * as inviteActions from '../../actions/inviteActions'
import Toast from '../../components/Toast'
import { login, platform, forwardApp } from 'utils'

import 'scss/activity/invite.component.scss'
import Popup from '../activity/components/Popup'
import PopupContent from './PopupContent'

const TabPane = Tabs.TabPane

@connect((store) => {
  return store.invite
})

export default class Reward extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    document.title = '我的奖金'
    this.props.dispatch(inviteActions.rewardInfo())
    this.props.dispatch(inviteActions.listOne())
  }

  componentWillUpdate (nextProps, nextState) {
    const { fetching2, reward } = nextProps
    fetching2 ? Toast.loading('') : Toast.hide()
    this.beforeButton(reward.code)
  }

  beforeButton (code) {
    if (typeof code === 'undefined') return false
    if (code === -1001) {
      login()
      return false
    }
    if (code !== 0) {
      Popup.alert(PopupContent.popupHtml(), 'popup popup-confirm')
      Popup.click('a.click', Popup.close)
      return false
    }
    return true
  }

  showRule () {
    const cashHtml = PopupContent.cashHtml()
    Popup.alert(cashHtml, 'rule cash')
  }

  goBind () {
    if (!platform.isApp) {
      Popup.alert(PopupContent.popupHtml('请下载最新的APP，<br />完成绑卡之后再提现哦！', '立即下载'), 'popup popup-confirm')
      Popup.click('a.click', forwardApp)
      return false
    }
    return true
  }

  drawal () {
    if (this.props.reward.account / 100 < 30) {
      return
    }
    if (this.goBind()) {
      const versionArr = platform.version.split('.')
      const version = parseInt(versionArr[0] + versionArr[1] + versionArr[2], 10)
      if (version < 147) {
        this.popupInfo('您的版本过旧，<br />请下载最新APP，<br />到“我的”-“现金红包”提现', '朕知道了')
        return
      }
      this.popupInfo('请到“我的”-“现金红包”提现', '朕知道了')
    }
  }

  render () {
    const { reward, listOne } = this.props
    const data = reward.data
    const listOneData = listOne.data

    const topList = data && data.top_ad ? data.top_ad.map((v, i) =>
      <span key={i}>{v.encode_name} 成功申请<i>{v.count}</i>人，领取奖励<i>{v.total_money / 100}</i>元；</span>
    ) : null

    const top = data && data.is_bind_card ? <p>{topList}</p> : <div className='no-bind clearfix'><span>若要领取奖金，请先绑定银行卡</span><a onClick={this.goBind.bind(this)}>去绑卡></a></div>

    const list1 = listOneData && listOneData.list.length > 0 ? listOneData.list.map((v, i) =>
      <div className='list' key={i}>
        <p>{v.name}<br /><small>{v.record_time}</small></p>
        <p>成功申请<br /><small>{v.amount / 100}</small></p>
        <p>{v.rebate / 100}</p>
      </div>
     ) : <div className='no-list'>暂无返利记录</div>

    return (
      <div className='transition-group'>
        <div className='reward'>
          <div className='top'>{top}</div>
          <div className='head'>
            <p>当前可提现奖金</p>
            <h1>{ data && data.account ? (data.account / 100).toFixed(2) : (0).toFixed(2) }<span>元</span></h1>
            <p>历史获得奖金：{ data && data.invite_account ? data.invite_account / 100 : 0 }元</p>
            <a className={ data && data.account / 100 >= 30 ? '' : 'disabled' } onClick={this.drawal.bind(this)} >立即提现</a>
          </div>
          <Tabs defaultActiveKey='1' swipeable={false}>
            <TabPane tab='一级邀请奖励' key='1'>
              <div className='reward-content'>
                {list1}
              </div>
            </TabPane>
            <TabPane tab='二级邀请奖励' key='2'>
              <div className='reward-content' />
            </TabPane>
          </Tabs>
          <WhiteSpace />
          <a className='a-cash' onClick={this.showRule.bind(this)}>提现说明</a>
        </div>
      </div>
    )
  }
}
