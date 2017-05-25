import React from 'react'
import Content from './Content'
import Lottery from '../components/Lottery'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, share, platform, login, redirect, goHome, copy } from 'utils'
import 'scss/activity/scratch.component.scss'
import 'img/activity/scratch-card/scratch-04.jpg'
import 'img/activity/scratch-card/scratch-10.jpg'

const totalLength = 7
let rewardFlag = 1
let toastFlag = 1
let width = 0
let height = 0

export default class Scratch extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      total: [0, 0, 0, 0, 0, 0, 0],
      prizeList: [],
      times: 0,
      exchangeGold: 0
    }
  }

  componentWillMount () {
    if (!platform.isApp) {
      document.body.className = 'copy'
    }
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/scratch-act/index').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup-show')
        if (data.code === -1001) {
          Popup.click('a.click', login)
          return
        }
        Popup.click('a.click')
        return
      }
      this.setState({
        total: this.formatTotal(data.data.person),
        prizeList: data.data.prize_list,
        times: data.data.times,
        exchangeGold: data.data.exchange_gold
      })
    })
  }

  componentDidMount () {
    document.title = '惊喜刮刮乐'
    share('scratch')
    width = document.getElementsByClassName('canvas')[0].offsetWidth
    height = document.getElementsByClassName('canvas')[0].offsetHeight
    this.init()
  }

  init () {
    Lottery.init(this.refs.lotteryContainer, '../assets/img/activity/scratch-card/scratch-04.jpg', 'image', width, height, 50, 60, '../assets/img/activity/scratch-card/scratch-10.jpg', 'image', this.scratch.bind(this))
  }

  scratch (per) {
    if (per > 35 && rewardFlag) {
      rewardFlag = 0
      Toast.loading('')
      get('http://credit.xianjincard.com/activity/scratch-act/scratch').then(data => data.data).then(data => {
        Toast.hide()
        Popup.alert(Content.rewardHtml(data.data, platform.isApp), 'popup-reward')
        Popup.addEventListener('a.copy', 'click', () => {
          copy(data.data.prize_sn)
        })
        this.setState({
          times: --this.state.times
        })
      })
    }
    if (per < 35 && toastFlag) {
      toastFlag = 0
      Toast.info('请在多刮一点哦', 2)
      setTimeout(() => {
        toastFlag = 1
      }, 2200)
    }
  }

  formatTotal (total) {
    let array = []
    let num = total + ''
    let length = num.length
    if (length < totalLength) {
      for (let i = 0; i < totalLength - length; i++) {
        num = '0' + num
      }
    }
    for (let i = 0; i < num.length; i++) {
      array = [...array, ...num[i]]
    }
    return array
  }

  showRule () {
    const { exchangeGold } = this.state
    Popup.alert(Content.ruleHtml(exchangeGold), 'popup-rule')
  }

  reward () {
    const { prizeList } = this.state

    Popup.alert(Content.myReward(prizeList, platform.isApp), 'popup-my')
    prizeList.map((v, i) => {
      Popup.addEventListener(`a.copy-${i}`, 'click', () => {
        copy(v.prize_sn)
      })
    })
  }

  exchange () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/scratch-act/exchange').then(data => data.data).then(data => {
      Toast.hide()
      Popup.alert(Content.showHtml(data.code), 'popup-show')
      if (data.code !== 0) {
        if (data.code === -1001) {
          Popup.click('a.click', login)
          return
        }
        if (data.code === -2031) {
          Popup.click('a.click', () => {
            redirect.push('/signin')
          })
          return
        }
      }
      Popup.click('a.click')
      this.setState({
        times: ++this.state.times
      })
    })
  }

  overlay () {
    Popup.alert(Content.showHtml(-2100), 'popup-show')
    Popup.click('a.click', goHome)
  }

  refresh () {
    this.init()
    rewardFlag = 1
  }

  render () {
    const { total, times } = this.state

    const li = total.map((v, i) => <li key={i}>{v}</li>)
    const overlay = times < 0 ? <div className='overlay' onClick={this.overlay.bind(this)} /> : null

    return (
      <div className='transition-group'>
        <div className='scratch'>
          <a className='rule' onClick={this.showRule.bind(this)}>活动锦囊</a>
          <div className='content'>
            <div className='join-total clearfix'>
              <span>参加<br />人数</span>
              <ul>
                {li}
              </ul>
            </div>
            <h3>您今天还有<b>{times}</b>次抽奖机会</h3>
            <div className='canvas-content'>
              {overlay}
              <i onClick={this.refresh.bind(this)} />
              <div ref='lotteryContainer' className='canvas' />
            </div>
            <a className='exchange' onClick={this.exchange.bind(this)}>金币兑换抽奖机会</a>
            <a className='reward' onClick={this.reward.bind(this)}>我的奖品</a>
          </div>
        </div>
      </div>
    )
  }
}
