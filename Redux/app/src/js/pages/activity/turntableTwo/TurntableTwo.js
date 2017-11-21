import React from 'react'
import Scroll from './Scroll'
import Rotate from './Rotate'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { login, get, share, redirect } from 'utils'
import 'scss/activity/turntable-two.component.scss'

const appMarket = 'Turntable-two'
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
    share('Turntable-two')
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
        Popup.alert(Content.errorHtml(data.code), 'popup')
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
      Popup.alert(Content.errorHtml(code), 'popup')
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
    Popup.alert(Content.rewardHtml(reward), 'popup popup-reward')
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
        get('http://credit.xianjincard.com/activity/turntable-act/exchange-times').then(data => data.data).then(data => {
          if (data.code !== 0 && data.code !== -2031) {
            setTimeout(() => {
              Popup.alert(Content.errorHtml(data.code), 'popup')
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
          <Scroll />
          <Rotate Turn={this} />
          <p className='chance'>您还有<b>{lotteryNumber}</b>次转盘机会</p>
          <a className='my-reward' onClick={this.reward.bind(this)}>查看我的奖品</a>
          <a className='exchange' onClick={this.exchange.bind(this)}>金币兑换抽奖机会</a>
          <div className='rule'>
            <h3><i className='left' />活动规则<i className='right' /></h3>
            <p><b>1</b>活动时间：2017年7月13日起；</p>
            <p><b>2</b>参与对象：平台用户；</p>
            <p><b>3</b>如何获得转盘机会：<br /><span>a.活动期间首次注册所有用户可获取1次机会；<br />b.邀请1人注册成功即可获得1次机会，每天最多可获得10次机会； <br />c.申请借款可获得1次机会，每月最多可获得5次机会；机会可以累计，不清零。</span></p>
            <p><b>4</b>奖品详情：<br /><span>a.返现券天数：随机获得1-14天；<br />b.现金红包：随机获得，最高100元，可直接提现；<br />c.提额券：随机获得，最高500元；<br />d.抵扣券：随机获得，最高100元。</span></p>
            <p><b>5</b>如何领取奖品：<br /><span>券奖励于获奖后24小时内发放，请至“我的”-“优惠券”中查看领取，所有券有效期20天；<br />获得实物奖的用户将收到平台短信，用户需在短信规定时间内联系客服验证信息，确认发放方式。</span></p>
            <p><b>6</b>券不可累加使用，与平台其他活动优惠不能同享；</p>
            <p><b>7</b>如有疑问，请联系客服：<span className='tel'>4006812016</span>；</p>
            <p><b>8</b>本活动最终解释权归现金卡所有，与Apple.lnc无关。</p>
          </div>
        </div>
      </div>
    )
  }
}
