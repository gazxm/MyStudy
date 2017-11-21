import React from 'react'
import Popup from '../components/Popup'
import Content from './Content'
import Toast from '../../../components/Toast'
import { get, share, login, goHome, statistics, resolveUrl } from 'utils'
import 'scss/activity/activity-day.component.scss'

export default class BackTwo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      pastData: [],
      winData: []
    }
  }

  componentWillMount () {
    this.fetch()
  }

  componentDidMount () {
    document.title = '借多少返多少'
    share('BackTwoDay')
  }

  fetch () {
    Toast.loading('')
    get(`http://credit.xianjincard.com/activity/default/lottery-result?result_no=backTwoD,backTwoP,backTwoW`).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(-3000), 'popup-back-two')
        Popup.click('a.click')
        return
      }
      this.setState({
        data: data.data.backTwoD,
        pastData: data.data.backTwoP,
        winData: data.data.backTwoW
      })
    }).catch(data => {
      Toast.hide()
      Popup.alert(Content.showHtml(-3000), 'popup-back-two')
      Popup.click('a.click')
    })
  }

  showRule () {
    Popup.alert(Content.showRule(3), 'popup-back-two popup-back-two-rule')
    Popup.click('b.red', () => {
      location.href = resolveUrl('http://h.xianjincard.com/mobile/wechat')
    })
  }

  past () {
    const { pastData } = this.state
    Popup.alert(Content.showPast(pastData), 'popup-back-two popup-back-two-past')
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
        Popup.alert(Content.showHtml(data.code), 'popup-back-two')
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

  render () {
    const { data, winData } = this.state

    const dataDiv = data && data.length > 0 ? data.map((v, i) => <tr key={i}>
      <td>{v.name}</td>
      <td>{v.phone}</td>
      <td>{v.prize_data}</td>
    </tr>) : <tr className='single'><td>暂无中奖名单</td></tr>

    const winDiv = winData && winData.length > 0 ? winData.map((v, i) => <tr key={i}><td>{v.prize_data.split(',')[0]}</td><td>{v.prize_data.split(',')[1]}</td></tr>) : <tr><td colSpan='2'>周四24点前公布开奖结果哦~</td></tr>

    return (
      <div className='transition-group'>
        <div className='back-two'>
          <a className='rule' onClick={this.showRule.bind(this)}>活动<br />规则</a>
          <h3>活动时间：周一10:00~周四15:00</h3>
          <a className='past' onClick={this.past.bind(this)}>上期名单</a>
          <p>活动期间点击“<b>借钱不用还</b>”按钮，成功借款且满足开奖条件的用户，即可获得“借多少返多少”特权，返还本金+服务费！</p>
          <a className='back-button' onClick={this.back.bind(this)}>借钱不用还</a>
          <h4>开奖区</h4>
          <table className='excel'>
            <tbody>
              <tr>
                <td>周四上证指数收盘结果</td>
                <td>获奖手机尾号</td>
              </tr>
              {winDiv}
            </tbody>
          </table>
          <div className='win'>
            <table className='table-one'>
              <tbody>
                <tr>
                  <td>获奖用户</td>
                  <td>手机号</td>
                  <td>返现金额</td>
                </tr>
              </tbody>
            </table>
            <div className='div-scroll'>
              <table className='table-two'>
                <tbody>
                  {dataDiv}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
