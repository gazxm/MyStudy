import React from 'react'

import {resolveUrl, login} from 'utils'
import axios from 'axios'

import Toast from '../../../components/Toast'

export default class Valentine extends React.Component {

  betBefore (e) {
    const {gift} = this.props
    if (gift.state.valentineInfo.code === -1) {
      gift.popupInfo('您还未登录，无法参与投注<br>请先登录', '点此登录', login)
      return
    }
    if (gift.state.valentineInfo.code === 0) {
      gift.popupInfo('本次投注将消耗一次机会<br/>投注后将获得夺宝号<br/>投注后不可更改<br/>确定投注吗？', '确定投注', this.bet.bind(this))
      return
    }
    gift.popupInfo(gift.state.valentineInfo.message, '朕知道了')
  }

  bet () {
    const {gift} = this.props
    Toast.loading('')
    axios.get(resolveUrl('http://credit.xianjincard.com/act/valentine-day')).then(data => data.data).then((data) => {
      Toast.hide()
      if (data.code === 0) {
        gift.setState({
          valentineInfo: {
            surplus: data.total,
            chance: data.count,
            code: data.code,
            myNumber: data.mag,
            luckyInfo: data.tag,
            is_open_lottery: data.is_open_lottery,
            last_period_no: data.last_period_no,
            lovefund_tender_total_num: data.lovefund_tender_total_num
          }
        })
        gift.popupInfo('恭喜你<br/>投注成功<br/>祝您好运', '朕知道了')
      } else {
        gift.popupInfo(data.msg, '朕知道了')
      }
    })
  }

  showRule (e) {
    const {gift} = this.props
    gift.showRule(e)
  }

  myLogin (e) {
    login()
  }

  render () {
    const {gift} = this.props
    let myNumberInfo = []
    for (let index in gift.state.valentineInfo.myNumber) {
      let n = '第' + index + '期：'
      gift.state.valentineInfo.myNumber[index].map((v, i) => {
        n += v + '、'
      })
      myNumberInfo.push(n.substr(0, n.length - 1))
    }
    let endDate = true
    if ((new Date()).valueOf() > 1487087999) {
      endDate = false
    }
    const lastPeriodNo = gift.state.valentineInfo.is_open_lottery && endDate ? gift.state.valentineInfo.last_period_no + 1 : gift.state.valentineInfo.last_period_no
    const myNumberList = gift.state.valentineInfo.myNumber ? myNumberInfo.map((v, i) => <p key={i}>{v}</p>) : <span>暂无数据</span>
    const luckyList = gift.state.valentineInfo.luckyInfo.length > 0 ? gift.state.valentineInfo.luckyInfo.map((v, i) => <p key={i}>{v}</p>) : <span>暂无数据</span>
    const width = ((gift.state.valentineInfo.lovefund_tender_total_num - gift.state.valentineInfo.surplus) / gift.state.valentineInfo.lovefund_tender_total_num) * 100 + '%'
    const chance = gift.state.valentineInfo.chance || gift.state.valentineInfo.chance === 0 ? <p>您还有<b>{gift.state.valentineInfo.chance}</b>次投注机会</p> : <p><a onClick={this.myLogin.bind(this)}>登录查看投注机会</a></p>
    return (
      <div class="valentine-content">
        <a class="rule" onClick={this.showRule.bind(this)}>夺宝<br/>规则</a>
        <h2>999元恋爱基金<span>(第{lastPeriodNo}期)</span></h2>
        <div class="betting">
          <div class="loading clearfix">
            <div class="loading-div">
              <div class="loading-content" style={{width}}></div>
            </div>
            <span>总需{gift.state.valentineInfo.lovefund_tender_total_num}号</span>
            <span>剩余<b>{gift.state.valentineInfo.surplus}</b>号</span>
          </div>
          <div class="bet">
            <a class="bet-a" onClick={this.betBefore.bind(this)}>我要投注</a>
            {chance}
          </div>
        </div>
        <div class="chance">
          <h3>如何获得投注机会？</h3>
          <p>① 2月1日之前注册且从未申请过的用户，在活动期间首次申请借款，可获得1次机会；</p>
          <p>② 活动期间成功放款一次，可获得1次机会；</p>
          <p>③ 活动期间邀请1个新用户注册，可获得1次机会，每人限10次。</p>
          <i></i>
        </div>
        <div class="myNumber">
          <h3>我的夺宝号码</h3>
          <div class="myNumber-list">
            {myNumberList}
          </div>
        </div>
        <div class="lucky">
          <h3>中奖详情</h3>
          <div class="lucky-list">
            {luckyList}
          </div>
        </div>
      </div>
    )
  }
}
