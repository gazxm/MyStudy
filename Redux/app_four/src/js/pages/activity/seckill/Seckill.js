import React from 'react'
import Scroll from './Scroll'
import Ticket from './Ticket'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, login, goHome, share } from 'utils'
import 'scss/activity/seckill.component.scss'

let prize = ['3天免息券', '2天免息券', '1天免息券']
let locked = 1
const appMarket = 'seckill'

export default class Seckill extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      scroll: {
        prize: prize
      },
      code: 0,
      nowTime: '00:00:00',
      actSTime: '',
      actETime: '',
      ticket: []
    }
  }

  componentWillMount () {
    let ticket = []
    const query = this.props.location.query
    Toast.loading('')
    get(`http://credit.xianjincard.com/activity/spike-act/index?tag=h5-20170425-spikeActivity_act`).then(data => data.data).then(data => {
      Toast.hide()
      this.setState({
        code: data.code,
        actSTime: data.data.act_start_time,
        actETime: data.data.act_end_time
      })
      for (let i in data.data.prizes) {
        ticket.push([data.data.prizes[i]])
      }
      this.setState({
        ticket: ticket,
        nowTime: data.data.cur_time
      })
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup')
        Popup.click('a.click')
        return
      }
      if (!data.data.is_login) {
        Popup.alert(Content.showHtml(-1001), 'popup')
        if (query.source_tag) {
          Popup.click('a.click', () => { login(query.source_tag) })
          return
        }
        Popup.click('a.click', () => { login(appMarket) })
        return
      }
    })
  }

  componentDidMount () {
    document.title = '限时秒杀'
    share('seckill')
  }

  componentDidUpdate () {
    const lt1 = this.state.nowTime.slice(0, 2) - 14
    const lt2 = this.state.nowTime.slice(0, 2) - 18

    if (lt2 >= 0 && locked) {
      locked = 0
      setTimeout(() => {
        for (let i = 50; i <= 100; i++) {
          prize = [...prize, ...[`${i}个金币`]]
        }
        this.setState({
          scroll: {
            prize: prize
          }
        })
      }, 6000)
      return
    }
    if (lt1 >= 0 && locked) {
      locked = 0
      setTimeout(() => {
        prize = [...prize, ...['5元抵扣券', '6元抵扣券', '7元抵扣券', '8元抵扣券', '9元抵扣券', '10元抵扣券']]
        this.setState({
          scroll: {
            prize: prize
          }
        })
      }, 6000)
      return
    }
  }

  rob (type) {
    Toast.loading('')
    get(`http://credit.xianjincard.com/activity/spike-act/get-prize?type=${type}`).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code === -2025) {
        Popup.alert(Content.showHtml(data.code, data.data.type, data.data.text_amount, data.data.name, data.data.expire, data.data.unit), 'popup')
        if (data.data.type === '1') {
          Popup.click('a.click', goHome)
          return
        }
        Popup.click('a.click')
        return
      }
      if (data.code !== 0 && data.code !== -2025) {
        Popup.alert(Content.showHtml(data.code), 'popup')
        if (data.code === -1001) {
          Popup.click('a.click', () => { login(appMarket) })
          return
        }
        Popup.click('a.click')
        return
      }
      let ticket = this.state.ticket
      ticket[type - 1][0].amount = data.data.left
      this.setState({
        ticket: ticket
      })
      Popup.alert(Content.showHtml(data.code, data.data.type, data.data.text_amount, data.data.name, data.data.expire, data.data.unit), 'popup')
      if (data.data.type === '1') {
        Popup.click('a.click', goHome)
        return
      }
      Popup.click('a.click')
    })
  }

  render () {
    const { scroll, ticket, nowTime, actSTime, actETime, code } = this.state

    const tk = ticket.map((v, i) => <Ticket key={i} ticket={v} nowTime={nowTime} code={code} rob={this.rob.bind(this)} />)

    return (
      <div className='transition-group'>
        <div className='seckill'>
          <Scroll scroll={scroll} />
          {tk}
          <div className='rule'>
            <h3>活动说明</h3>
            <p>一、活动时间：{actSTime}-{actETime}</p>
            <p>二、开抢条件：平台用户，每人每天有一次秒杀机会</p>
            <p>三、奖励发放：券有效期1天；金币可至金币商城兑换丰富礼品，券和金币请至APP中【我的】页面查看</p>
            <p>四、本活动最终解释权归现金卡所有，与Apple.Inc无关</p>
          </div>
        </div>
      </div>
    )
  }
}
