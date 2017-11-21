import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, share, login, goHome, goCertification, statistics } from 'utils'
import 'scss/activity/activity-day.component.scss'

export default class Back extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount () {
    document.title = '返现day'
    share('BackDay')
  }

  back () {
    statistics({
      type: '返现day',
      tag: '借钱不用还'
    })
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/default/act-flag-user?key=activityDay_act').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup popup-back')
        if (data.code === -1001) {
          Popup.click('a.click', login)
          return
        }
        Popup.click('a.click')
        return
      }
      goHome()
    })
  }

  showRule () {
    Popup.alert(Content.showRule(1), 'popup-rule')
    Popup.click('a.click')
  }

  gold () {
    statistics({
      type: '返现day',
      tag: '申请金卡'
    })
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/default/act-info').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup popup-back')
        Popup.click('a.click')
        return
      }
      if (!data.data.login) {
        Popup.alert(Content.showHtml(-1001), 'popup popup-back')
        Popup.click('a.click', login)
        return
      }
      Toast.loading('')
      get('http://credit.xianjincard.com/activity/activity-day-act/card-type').then(data => data.data).then(data => {
        Toast.hide()
        Popup.alert(Content.showHtml(data.data.card_type, '', '', data.data.need_loan_num), 'popup popup-back')
        if (data.data.card_type === '0') {
          Popup.click('a.click', goCertification)
          return
        }
        Popup.click('a.click', goHome)
      })
    })
  }

  render () {
    return (
      <div className='transition-group'>
        <div className='back'>
          <a className='rule' onClick={this.showRule.bind(this)} />
          <div className='content'>
            <p>你有没有想过，如果有一天，给你一笔钱还不用还。<br />你会怎么面对？<br />当然，你会说逗谁呢，我又不是小孩子。<br />那你就错了，天上掉馅饼的机会真的来了。<br />我们找老板要了10万，返完为止。<br />要想拿到这笔钱，就看你能借多少<br />借的越多，返的越多~</p>
            <a onClick={this.back.bind(this)}>借钱不用还</a>
          </div>
          <div className='card-content'>
            <div className='gold' onClick={this.gold.bind(this)} />
            <p>额度范围：2000——3000元<br />借款周期：30天<br />综合费率：0.33%/天<br />还款方式：一次性偿还本金</p>
          </div>
        </div>
      </div>
    )
  }
}
