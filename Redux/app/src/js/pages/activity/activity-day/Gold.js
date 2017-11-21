import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { resolveUrl, get, login, share, statistics } from 'utils'
import 'scss/activity/activity-day.component.scss'
import 'img/activity/activity-day/activity-05.png'
import 'img/activity/activity-day/activity-06.png'
import 'img/activity/activity-day/activity-07.png'
import 'img/activity/activity-day/activity-08.jpg'
import 'img/activity/activity-day/activity-09.png'
import 'img/activity/activity-day/activity-10.png'

let locked = 0

export default class Gold extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      shovelStyle: {},
      goldStyle: {}
    }
  }

  componentDidMount () {
    document.title = '淘金day'
    share('GoldDay')
    Toast.loading('')
    Toast.hide()
  }

  showRule () {
    Popup.alert(Content.showRule(2), 'popup-rule')
    Popup.click('a.click')
  }

  forward (type) {
    switch (type) {
      case 1:
        statistics({
          type: '淘金day',
          tag: '签到领金币'
        }).then(() => {
          window.location.href = resolveUrl('http://h.xianjincard.com/signin')
        })
        break
      case 2:
        statistics({
          type: '淘金day',
          tag: '任务悬赏'
        }).then(() => {
          window.location.href = resolveUrl('http://h.xianjincard.com/integral/tasks')
        })
        break
      case 3:
        statistics({
          type: '淘金day',
          tag: '优惠券区'
        }).then(() => {
          window.location.href = resolveUrl('http://h.xianjincard.com/integral/mall/15')
        })
        break
      case 4:
        statistics({
          type: '淘金day',
          tag: '人气推荐区'
        }).then(() => {
          window.location.href = resolveUrl('http://h.xianjincard.com/integral/mall/17')
        })
        break
      case 5:
        statistics({
          type: '淘金day',
          tag: '商品券区'
        }).then(() => {
          window.location.href = resolveUrl('http://h.xianjincard.com/integral/mall/16')
        })
        break
      case 6:
        statistics({
          type: '淘金day',
          tag: '全民猜猜猜'
        }).then(() => {
          window.location.href = resolveUrl('http://h.xianjincard.com/activity/guess')
        })
        break
    }
  }

  shovel (type) {
    if (locked) {
      Toast.info('还在挖宝中哦~')
      return
    }
    statistics({
      type: '淘金day',
      tag: '挖金币'
    })
    this.setState({
      goldStyle: {
        display: 'none',
        zIndex: 'auto'
      }
    })
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/activity-day-act/pan-gold-day').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup popup-gold')
        if (data.code === -1001) {
          Popup.click('a.click', login)
          return
        }
        Popup.click('a.click')
        return
      }
      if (type === 1) {
        this.dig(2.5, data.code, data.data.gold)
      }
      if (type === 2) {
        this.dig(5.05, data.code, data.data.gold)
      }
      if (type === 3) {
        this.dig(7.6, data.code, data.data.gold)
      }
    })
  }

  dig (left, code, gold) {
    locked = 1
    this.setState({
      shovelStyle: {
        display: `block`,
        left: `${left}rem`
      },
      goldStyle: {
        display: `block`,
        left: `${left - (Math.random() * 0.1 + 0.2)}rem`
      }
    })
    setTimeout(() => {
      this.setState({
        goldStyle: {
          ...this.state.goldStyle,
          zIndex: '3'
        }
      })
    }, 1600)
    setTimeout(() => {
      this.setState({
        shovelStyle: {
          display: 'none'
        },
        goldStyle: {
          display: 'none'
        }
      })
      locked = 0
      Popup.alert(Content.showHtml(code, 1, gold), 'popup popup-gold')
      Popup.click('a.click', () => {
        location.href = resolveUrl('http://h.xianjincard.com/signin/detailed')
      })
    }, 3000)
  }

  render () {
    const { shovelStyle, goldStyle } = this.state

    return (
      <div className='transition-group'>
        <div className='gold'>
          <div className='rule' onClick={this.showRule.bind(this)} />
          <div className='dig'>
            <div className='treasure' onClick={() => this.shovel(1)}>
              <span>1号地</span>
            </div>
            <div className='treasure' onClick={() => this.shovel(2)}>
              <span>2号地</span>
            </div>
            <div className='treasure' onClick={() => this.shovel(3)}>
              <span>3号地</span>
            </div>
            <i className='reward-gold gold-anim1' style={goldStyle} />
            <i className='reward-gold gold-anim2' style={goldStyle} />
            <i className='shovel' style={shovelStyle} />
          </div>
          <div className='content'>
            <div className='card' onClick={() => this.forward(1)}>
              <h3>签到领金币</h3>
              <h4>Sign Up For Gold Coins</h4>
              <a>立刻点击</a>
            </div>
            <div className='card' onClick={() => this.forward(2)}>
              <h3>任务悬赏</h3>
              <h4>Mission Reward</h4>
              <a>立刻点击</a>
            </div>
          </div>
          <div className='content consumer'>
            <div className='card' onClick={() => this.forward(3)}>
              <h3>优惠券区</h3>
              <h4>Saver Ticket</h4>
              <a>立刻点击</a>
            </div>
            <div className='card' onClick={() => this.forward(4)}>
              <h3>人气推荐区</h3>
              <h4>Popular Recommendation</h4>
              <a>立刻点击</a>
            </div>
            <div className='card' onClick={() => this.forward(5)}>
              <h3>商品券区</h3>
              <h4>Coupons</h4>
              <a>立刻点击</a>
            </div>
            <div className='card' onClick={() => this.forward(6)}>
              <h3>全民猜猜猜</h3>
              <h4>Let's Guess</h4>
              <a>立刻点击</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
