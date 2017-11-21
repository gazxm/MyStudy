import React from 'react'
import { Link } from 'react-router'
import {Toast} from 'antd-mobile'
import 'scss/activity/treasure.component.scss'
import Popup from '../components/Popup'
import {get, post, login, goHome, goCertification, resolveUrl} from 'utils'

export default class Treasure extends React.Component {
  constructor (props) {
    super(props)
    document.title = '夺宝'
    this.state = {
      clsName: 'empty',
      login: 0,
      indianaNumber: 0,
      indiana: '登录查看夺宝券',
      surplus: 0,
      userRecord: [],
      winningRecord: []
    }
  }
  componentDidMount () {
    this.fetchData()
  }

  fetchData () {
    Toast.loading('加载中...', 0)
    get('http://credit.xianjincard.com/operate-activity/mother-entrance?tag=h5-19700101-motherDay').then(response => {
      // console.log(response)
      Toast.hide()
      const {code, message, data} = response.data
      if (parseInt(code) !== 0) {
        Toast.info(message, 2)
        return
      }
      this.setState({...data})
    }).catch(response => {
      Toast.hide()
    })
  }
  fetchTicket (e) {
    e.preventDefault()
    if (!this.login()) {
      return
    }
    let html = `
      <div>
        <h1></h1>
        <div class="time"><p>活动时间：5月11日10:00起</p></div>
        <ul>
          <li>
            <div>
              <h2>成功借款</h2>
              <p>成功借款，获夺宝券1张</p>
            </div>
            <button data-type="0">去借款</button>
          </li>
          <li>
            <div>
              <h2>分享邀请</h2>
              <p>好友注册，每天最多获夺宝券10张</p>
            </div>
            <button data-type="1">去邀请</button>
          </li>
        </ul>
      </div>`
    Popup.alert(html, 'treasure-fetch-ticket')
    Popup.click('button', function (e) {
      let type = parseInt(e.target.getAttribute('data-type'))
      get('http://credit.xianjincard.com/operate-activity/mother-obtain', {type: type})

      if (type === 0) {
        goHome()
        return
      }
      if (type === 1) {
        location.href = resolveUrl('http://credit.xianjincard.com/credit-invite/invite-rebate-start?clientType=wap')
        return
      }
    })
  }
  popup (content, btnText, callback) {
    Popup.alert(`<p>${content}</p><button>${btnText}</button>`, 'treasure-popup')
    Popup.click('button', callback)
  }
  login () {
    if (this.state.login === 1) {
      return true
    }
    this.popup('您还没登录</br>无法参与夺宝，请先登录', '点击登录', login)
  }
  bet () {
    if (this.login()) {
      if (this.state.indianaNumber <= 0) {
        this.popup('夺宝券为0</br>无法投注', '确定')
        return
      }
      this.popup('本次投注将消耗1张夺宝券</br>参与后获得夺宝号</br>投注后不可更改</br>确定投注吗?', '确定投注', this.sendBet.bind(this))
    }
  }
  sendBet () {
    post('http://credit.xianjincard.com/operate-activity/betting').then(response => {
      // console.log(response)
      const {code, message, data} = response.data
      if (code !== 0) {
        Toast.info(message, 2)
        return
      }
      this.setState({userRecord: data.userRecord, indianaNumber: data.count, surplus: data.surplus})
      this.popup('恭喜你</br>投注成功</br>祝您好运', '朕知道了')
    })
  }
  onAll (e) {
    e.preventDefault()
    this.setState({clsName: ''})
  }
  ticketList () {
    const {userRecord} = this.state
    if (userRecord.length <= 0) {
      return <div>暂无数据</div>
    }
    return userRecord.map((v, i) => <li key={i}>第{v.key}期: {v.value.join(', ')}</li>)
  }
  prizeList () {
    const {winningRecord} = this.state
    if (winningRecord.length <= 0) {
      return <li>暂无数据</li>
    }
    return winningRecord.map((v, i) => <li key={i}>{v}</li>)
  }
  render () {
    const {login, indianaNumber, surplus, clsName, stage, winningRecord} = this.state
    let btn = login === 0 ? '登录查看夺宝券' : `我的夺宝券(${indianaNumber})`
    return (
      <div class='activity-treasure'>
        <div class='top'>
          <button onClick={this.login.bind(this)}>{btn}</button>
          <button onClick={this.fetchTicket.bind(this)}>获取夺宝券</button>
        </div>
        <h1 dangerouslySetInnerHTML={{__html: stage}} />
        <h3>每期奖金<i>1000</i>元</h3>
        <div class='progress'><div style={{width: `${(1000 - surplus) / 1000 * 100}%`}} /></div>
        <div class='progress-info'>
          <span>集齐1000份开奖哦</span>
          <span>距开奖还差<i>{surplus}</i>份</span>
        </div>
        <button class='bet' onClick={this.bet.bind(this)}>我要投注</button>
        <div class='ticket-list'>
          <ul>
            {this.ticketList()}
          </ul>
        </div>
        <div class='prize-list'>
          <span class='head' />
          <div>
            <h4>往期中奖结果</h4>
            <ul class={clsName}>
              {this.prizeList()}
            </ul>
            {winningRecord.length > 3 && clsName !== '' && <div class='bar'><a href='' onClick={this.onAll.bind(this)}>查看全部</a></div>}
          </div>
          <span class='bottom' />
        </div>
        <Link to='/activity/treasure/rule' class='rule' />
      </div>
    )
  }
}
