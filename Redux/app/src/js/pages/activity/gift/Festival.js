import React from 'react'
import {platform, resolveUrl, login} from 'utils'
import axios from 'axios'

import Toast from '../../../components/Toast'

export default class Festival extends React.Component {
  constructor (props) {
    super(props)
    this.fonts = ['现', '金', '白', '卡', '鸡', '年', '大', '吉']
    this.f = []
  }

  raddle (val, event) {
    let active = event.currentTarget.className
    if (active === 'active') {
      event.currentTarget.className = ''
      this.f = this.f.filter((v, i) => v !== val)
    } else {
      if (this.f.length >= 3) return
      event.currentTarget.className = 'active'
      this.f.push(val)
    }
  }

  answer (e) {
    const {gift} = this.props
    let selectFont = this.f.sort(function (a, b) { return a - b }).join('')
    Toast.loading('')
    axios.post(resolveUrl('http://credit.xianjincard.com/act/yuan-xiao'), `number=${selectFont}`).then(data => data.data).then((data) => {
      Toast.hide()
      if (data.code === -1) {
        gift.popupInfo(data.message, '点此登录', login)
        return
      }
      if (data.code === 0 && !platform.isApp) {
        gift.popupInfo(data.message + '<br>快去APP内查看吧', '打开APP', gift.forwardApp)
        return
      }
      if (data.code === -3 && !platform.isApp) {
        gift.popupInfo(data.message, '查看奖励', gift.forwardApp)
        return
      }
      gift.popupInfo(data.message, '朕知道了')
    })
  }

  showRule (e) {
    const {gift} = this.props
    gift.showRule(e)
  }

  render () {
    const spans = this.fonts.map((v, i) => <span key={i} onTouchEnd={this.raddle.bind(this, i)}><i></i><b>{v}</b></span>)
    return (
      <div class="festival-content">
        <div class="content">
          <div class="content-rule">
            <h1>猜灯谜<br/>赢奖励</h1>
            <p>答对灯谜即可随机获得奖励<br/>奖励包括：现金红包、现金券、<br/>免息券、话费、提升借款额度等。</p>
            <a onClick={this.showRule.bind(this)}>点此查看详细规则</a>
          </div>
          <div class="riddle">
            <p>① 左右见君颜<span>(打一字)</span></p>
            <p>② 值不值钱,全在两点<span>(打一字)</span></p>
            <p>③ 上下一体<span>(打一字)</span></p>
          </div>
          <h3>请在下方选出对应的三个谜底：</h3>
          <div class="answer">
           {spans}
          </div>
        </div>
        <a onClick={this.answer.bind(this)} class="sumbit">提交答案赢奖励</a>
        <p class="explain">本活动解释权归现金卡所有，与Apple.Inc无关</p>
      </div>
    )
  }
}

