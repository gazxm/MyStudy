import React from 'react'
import Scroll from './Scroll'
import Ticket from './Ticket'
import Content from './ContentTwo'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, login, share, resolveUrl, statistics, goHome } from 'utils'
import 'scss/activity/activity-day.component.scss'

let prize = ['3天返现券', '2天返现券', '1天返现券']
let locked = 1
const appMarket = 'Free'

export default class Free extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      scroll: {
        prize: prize
      },
      code: 0,
      nowTime: '00:00:00',
      ticket: []
    }
  }

  componentWillMount () {
    let ticket = []
    const query = this.props.location.query
    Toast.loading('')
    get(`http://credit.xianjincard.com/activity/activity-day-act/free-day`).then(data => data.data).then(data => {
      Toast.hide()
      this.setState({
        code: data.code
      })
      for (let i in data.data.prizes) {
        ticket.push([data.data.prizes[i]])
      }
      this.setState({
        ticket: ticket,
        nowTime: data.data.cur_time
      })
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup popup-free')
        Popup.click('a.click')
        return
      }
      if (!data.data.is_login) {
        Popup.alert(Content.showHtml(-1001), 'popup popup-free')
        if (query.source_tag) {
          Popup.click('a.click', () => { login(query.source_tag) })
          return
        }
        Popup.click('a.click', () => { login(appMarket) })
      }
    })
  }

  componentDidMount () {
    document.title = '秒杀day'
    share('FreeDay')
  }

  componentDidUpdate () {
    const lt1 = this.state.nowTime.slice(0, 2) - 14
    const lt2 = this.state.nowTime.slice(0, 2) - 17

    if (lt2 >= 0 && locked) {
      locked = 0
      setTimeout(() => {
        prize = [...prize, ...['100元提额券', '200元提额券', '300元提额券']]
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
    }
  }

  rob (type, name) {
    statistics({
      type: '秒杀day',
      tag: name
    })
    let ticket = this.state.ticket
    Toast.loading('')
    get(`http://credit.xianjincard.com/activity/activity-day-act/free-day-spike?type=${type}`).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code === -2025) {
        Popup.alert(Content.showHtml(data.code, data.data.msg), 'popup popup-free')
        Popup.click('a.click', () => {
          location.href = resolveUrl('http://h.xianjincard.com/mobile/coupon')
        })
        return
      }
      if (data.code !== 0 && data.code !== -2025) {
        Popup.alert(Content.showHtml(data.code), 'popup popup-free')
        if (data.code === -1001) {
          Popup.click('a.click', () => { login(appMarket) })
          return
        }
        if (data.code === -2012 || data.code === -2013 || data.code === -2024 || data.code === -2035 || data.code === -2036) {
          for (let i of ticket) {
            if (i[0].type === type) {
              i[0].amount = 0
            }
          }
          this.setState({
            ticket: ticket
          })
        }
        if (data.code === -2003) {
          Popup.click('a.click', goHome)
          return
        }
        Popup.click('a.click')
        return
      }
      for (let i of ticket) {
        if (i[0].type === type) {
          i[0].amount = data.data.left
        }
      }
      this.setState({
        ticket: ticket
      })
      Popup.alert(Content.showHtml(data.code, data.data.msg), 'popup popup-free')
      Popup.click('a.click', () => {
        location.href = resolveUrl('http://h.xianjincard.com/mobile/coupon')
      })
    })
  }

  forward () {
    const { code } = this.state
    if (code === -2013 || code === -2035) {
      Popup.alert(Content.showHtml(code), 'popup popup-free')
      Popup.click('a.click')
      return
    }
    statistics({
      type: '秒杀day',
      tag: '金币换提额券'
    }).then(() => {
      if (location.hostname === '192.168.39.214') {
        location.href = 'http://192.168.39.214:8000/integral-mall'
        return
      }
      location.href = resolveUrl('http://h.xianjincard.com/integral-mall')
    })
  }

  render () {
    const { scroll, ticket, nowTime, code } = this.state

    const tk = ticket.map((v, i) => <Ticket key={i} ticket={v} nowTime={nowTime} code={code} rob={this.rob.bind(this)} />)

    return (
      <div className='transition-group'>
        <div className='free'>
          <Scroll scroll={scroll} />
          {tk}
          <a className='a-gold' onClick={this.forward.bind(this)} />
          <div className='rule'>
            <h3>活动说明</h3>
            <p>一、适用人群：成功还款≥1次的平台用户；</p>
            <p>二、开抢条件：平台用户，每人每天有一次秒杀机会；</p>
            <p>三、奖励发放：返现、抵扣券有效期3天；提额券有效期10天；查看券详情，请至【我的】-【优惠券】中查看</p>
            <p>四、本活动最终解释权归现金卡所有，与Apple.inc无关</p>
          </div>
        </div>
      </div>
    )
  }
}
