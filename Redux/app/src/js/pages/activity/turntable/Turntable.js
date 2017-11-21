import React from 'react'
import Scroll from './Scroll'
import Rotate from './Rotate'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { login, get, share, redirect } from 'utils'
import 'scss/activity/turntable.component.scss'

const appMarket = 'Turntable'
const goldConsume = 100

export default class Turntable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      lotteryNumber: 0,
      locked: 1,
      isError: 0,
      isLogin: 0,
      code: 0,
      inviteCode: '',
      gold: 0,
      arr: []
    }
  }

  componentDidMount () {
    document.title = '现金卡大转盘'
    share('Turntable')
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/turntable-act/index').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0 && data.code !== -1001) {
        this.setState({
          isError: 1,
          code: data.code
        })
        if (data.code === -2013) {
          this.setState({
            arr: data.data.list
          })
        }
        if (data.data.invite_code) {
          this.setState({
            inviteCode: data.data.invite_code
          })
        }
        Popup.alert(Content.errorHtml(data.code), 'popup popup-error')
        return
      }
      if (data.code === -1001) {
        this.setState({
          isLogin: 0
        })
        return
      }
      if (data.data.gold === null) {
        data.data.gold = 0
      }
      this.setState({
        isLogin: 1,
        lotteryNumber: data.data.times,
        inviteCode: data.data.invite_code,
        gold: data.data.gold,
        arr: data.data.list
      })
    })
  }

  userLogin (content) {
    const { isError, code } = this.state
    const query = this.props.location.query
    const inviteCode = query.invite_code && query.invite_code !== 'undefined' ? query.invite_code : ''
    if (isError) {
      Popup.alert(Content.errorHtml(code), 'popup popup-error')
      return
    }
    Popup.alert(Content.loginHtml(content), 'popup')
    if (query.source_tag) {
      Popup.click('a.login', () => { login(query.source_tag, inviteCode) })
      return
    }
    Popup.click('a.login', () => { login(appMarket, inviteCode) })
  }

  reward () {
    const { isLogin, arr, locked, code } = this.state
    if (!isLogin && code !== -2013) {
      this.userLogin()
      return
    }
    if (!locked) {
      Toast.info('亲，请等待抽奖完再查看奖励哦！', 2)
      return
    }
    if (!arr.length) {
      Popup.alert(Content.rewardHtml(), 'popup')
      return
    }
    const reward = arr.map((v, i) => `<li key={${i}}>${v.time} <b>${v.title}</b></li>`).join('')
    Popup.alert(Content.rewardHtml(reward), 'popup')
  }

  exchange () {
    const { isLogin, locked, gold } = this.state
    let { lotteryNumber } = this.state
    if (!isLogin) {
      this.userLogin('3')
      return
    }
    if (!locked) {
      Toast.info('亲，请等待抽奖完再兑换哦！', 2)
      return
    }
    if (gold >= goldConsume) {
      Popup.alert(Content.goldHtml(gold, goldConsume), 'popup')
      Popup.click('a.click', () => {
        get('http://credit.xianjincard.com//activity/turntable-act/exchange-times').then(data => data.data).then(data => {
          if (data.code !== 0 && data.code !== -2031) {
            setTimeout(() => {
              Popup.alert(Content.errorHtml(data.code), 'popup popup-error')
            }, 350)
            return
          }
          if (data.code === -2031) {
            setTimeout(() => {
              Popup.alert(Content.errorHtml(-2031, gold), 'popup')
              Popup.click('a.click', () => {
                redirect.push('/signin')
              })
            }, 350)
            return
          }
          this.setState({
            lotteryNumber: ++lotteryNumber,
            gold: gold - goldConsume
          })
          Toast.info('兑换成功', 2)
        })
      })
      return
    }
    Popup.alert(Content.errorHtml(-2031, gold), 'popup')
    Popup.click('a.click', () => {
      redirect.push('/signin')
    })
  }

  render () {
    const { lotteryNumber } = this.state

    return (
      <div className='transition-group'>
        <div className='turntable'>
          <div className='head' />
          <div className='content'>
            <Scroll />
            <Rotate Turn={this} />
            <p className='chance'>您还有<b>{lotteryNumber}</b>次转盘机会</p>
            <a className='reward'><span onClick={this.reward.bind(this)}>查看我的奖品</span></a>
            <a className='gold-chance' onClick={this.exchange.bind(this)}>金币兑换转盘机会</a>
            <i className='wave' />
            <div className='rule'>
              <h3>活动规则</h3>
              <p><b>1</b>活动时间：2017.03.28起；</p>
              <p><b>2</b>参与对象：平台注册会员；</p>
              <p><b>3</b>如何获得转盘机会：<br /><span>活动期间首次登陆可获取抽奖机会1次；<br />邀请好友注册成功即可获取抽奖机会（邀请1人注册成功获取1次抽奖机会）；<br />申请借款可获得抽奖机会1次；<br />消耗{goldConsume}个金币来兑换一次抽奖机会；<br />抽奖机会可以累计，不清零，每天抽奖次数上限10次。</span></p>
              <p><b>4</b>如何领取奖品：<br /><span>券奖励于获奖后24小时内发放，请至“我的”-“我的优惠”中查看领取，所有券有效期20天。<br />获得实物奖的用户将收到平台短信，用户需在短信规定时间内联系客服验证信息，确认发放方式。</span></p>
              <p><b>5</b>券不可累加使用，与平台其他活动优惠不能同享；</p>
              <p><b>6</b>现金卡客服热线：<span className='tel'>4006812016</span>；</p>
              <p><b>7</b>本活动最终解释权归现金卡平台所有，与Apple.Inc无关</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
