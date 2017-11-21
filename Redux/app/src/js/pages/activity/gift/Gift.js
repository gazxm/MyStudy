import React from 'react'

import 'scss/activity/gift.component.scss'

import Download from '../components/DownloadPopup'

import {platform, resolveUrl, share} from 'utils'
import axios from 'axios'

import Toast from '../../../components/Toast'

import Festival from './Festival'
import Valentine from './Valentine'

export default class Gift extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ruleState: false,
      popupState: {
        isShow: false,
        tip: '',
        content: '',
        callback: ''
      },
      tabState: true,
      valentineInfo: {
        surplus: 0,
        chance: '0',
        code: '',
        message: '',
        myNumber: {},
        luckyInfo: [],
        is_open_lottery: '',
        last_period_no: '',
        lovefund_tender_total_num: ''
      }
    }
  }
  componentDidMount () {
    document.title = '开春有礼'
    share('springGift')
    Toast.loading('')
    axios.get(resolveUrl('http://credit.xianjincard.com/act/two-start')).then(data => data.data)
    .then((data) => {
      Toast.hide()
      if (data.code === 0 || data.code === -1) {
        if (data.data === 1) {
          this.setState({tabState: true})
        } else {
          this.setState({tabState: false})
          this.setState({
            valentineInfo: {
              surplus: data.total,
              chance: data.count,
              code: data.code,
              message: data.message,
              myNumber: data.mag,
              luckyInfo: data.tag,
              is_open_lottery: data.is_open_lottery,
              last_period_no: data.last_period_no,
              lovefund_tender_total_num: data.tender_total_num
            }
          })
        }
      } else if (data.code === -10) {
        this.setState({tabState: false})
        this.setState({
          valentineInfo: {
            surplus: data.total,
            chance: data.count,
            code: data.code,
            message: data.message,
            myNumber: data.mag,
            luckyInfo: data.tag,
            is_open_lottery: data.is_open_lottery,
            last_period_no: data.last_period_no,
            lovefund_tender_total_num: data.tender_total_num
          }
        })
        this.popupInfo(data.message, '朕知道了')
        return
      } else {
        this.popupInfo(data.message, '朕知道了')
        return
      }
    }).catch()
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
  showRule (e) {
    e.stopPropagation()
    e.preventDefault()
    this.setState({ruleState: true})
  }
  closeRule (e) {
    e.stopPropagation()
    e.preventDefault()
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
    const {ruleState, popupState, tabState} = this.state
    const popup = popupState.isShow ? <div class='popup'>
      <div class='overlay' onClick={(this.closePopup.bind(this))} />
      <div class='dialog'>
        <span class='close' onClick={this.closePopup.bind(this)} />
        <p dangerouslySetInnerHTML={{__html: popupState.content}} />
        <a onClick={this.okPopup.bind(this)}>{popupState.tip}</a>
      </div>
    </div> : null

    const ruleContent = tabState ? <div class='rule-content'>
      <p>活动时间：2月10日0:00-2月11日24:00</p>
      <p>活动期间所有注册用户均可参与猜灯谜，可在8个字中选出符合答案的3个答案，猜对的用户即可随机获得奖励，奖励包括：现金红包、现金券、免息券、话费、借款额度等</p>
      <p>现金红包、话费将在活动结束后3个工作日内统一发放至中奖用户绑定的银行卡及手机账户中；</p>
      <p>现金券、免息券、借款额度将及时发放至中奖用户现金卡账户中，请及时查收使用。</p>
    </div> : <div class='rule-content'>
      <p>1. 活动时间：2月12日0:00-2月14日24:00，在活动期间满足一下条件即可获得投注机会，参与夺宝；<br />获得投注机会的条件：<br />
                                                  ① 2月1日之前注册且从未申请过的用户，在活动期间首次申请借款，可获得1次机会；<br />
                                                  ② 在活动期间成功放款一次，可获得1次机会；<br />
                                                  ③活动期间邀请1个新用户注册，可获得1次机会，每人限10次。
                                              </p>
      <p>2. 每期的活动奖品为999元现金，每期夺宝集齐999次投注即可开奖。用户进行投注后，按投注顺序获得三位数夺宝号，可多次投注增加中奖概率；</p>
      <p>3. 开奖规则如下：<br />
                                                中奖号码=（数值A÷999）取余数+1<br />
                                                每期夺宝时会记录每个参与用户的投注时间，将对最后50个投注时间进行求和，得出数据A<br />
                                                数值A=活动项目最后50个投注时间点数值之和<br />
                                                例如最后一个投注时间点为11:30:12，则换算为113012<br />
                                                余数是指整数除法中被除数未被除尽部分，例如17除3，商数为5，余数为2
                                              </p>
      <p>4. 活动期间最多开奖20期，第20期开完活动结束，先到先得哦。如2月14日24:00时，还有未开的期数，则以该期数开奖为最终结束时间；</p>
      <p>5. 获奖名单将公布在活动页面，请获奖者在获奖5天内致电4006812016联系我们，逾期视为自动放弃，确认信息后奖金将打至用户绑定的银行卡中；</p>
      <p>6. 如发现存在违法行为（包括但不限于恶意套取奖品、机器作弊等违反诚实守信原则行为）现金卡有权取消中奖资格，必要时追究法律责任；</p>
      <p>7. 如出现不可抗或情势变更的情况（包括但不限于重大灾难事件、受政府机关指令调整或停办、严重网络故障攻击等）现金卡有权暂停或取消本次活动，并依据相关法律法规的规定主张免责；</p>
      <p>8. 本活动解释权归现金卡所有，与Apple.lnc无关。</p>
    </div>

    const rule = ruleState ? <div class='rule'>
      <div class='overlay' onClick={this.closeRule.bind(this)} />
      <div class='dialog'>
        <span class='close' onClick={this.closeRule.bind(this)} />
        <h3>活动规则</h3>
        {ruleContent}
      </div>
    </div> : null

    const content = tabState ? <Festival gift={this} /> : <Valentine gift={this} />

    return (
      <div>
        <div class='transition-group'>
          <div class='spring-gift'>
            <div class='gift-tab'>
              <div className={tabState ? 'festival-tab tab-active' : 'festival-tab'}>
                <h3>元宵喜乐会</h3>
                <h4>猜灯谜 提额度 得免息</h4>
                <h4>2月10日-2月11日</h4>
              </div>
              <div className={tabState ? 'valentine-tab' : 'valentine-tab tab-active'}>
                <h3>为爱夺宝</h3>
                <h4>夺取999元恋爱基金</h4>
                <h4>2月12日-2月14日</h4>
              </div>
            </div>
            <div class='gift-content'>
              {content}
            </div>
          </div>
        </div>
        {rule}
        {popup}
        <Download />
      </div>
    )
  }
}
