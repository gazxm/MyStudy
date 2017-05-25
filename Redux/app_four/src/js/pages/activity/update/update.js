import React from 'react'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, login, share, goCertification } from 'utils'
import 'scss/activity/update.component.scss'
import 'img/activity/update/m_01.png'
import 'img/activity/update/m_02.png'
import 'img/activity/update/m_03.png'

export default class Update extends React.Component {
  constructor (props) {
    super(props)
    this.state = {isLogin: false}
  }

  componentDidMount () {
    document.title = '产品升级'
    share('Update')
    this.fetch()
  }

  fetch () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/default/get-invite-code').then(data => {
      Toast.hide()
      if (data.data.code !== -1001 && data.data.code !== 0) {
        Popup.alert(`<p>服务器繁忙 请稍后再试</p><a class='click'>朕知道了</a>`, 'popup')
        Popup.click('a.click')
        return
      }
      this.setState({isLogin: data.data.code === 0})
    })
  }

  forward = (tag) => {
    if (!this.state.isLogin) {
      Popup.alert(`<p>您还未登录哦，请先登录</p><a class='click'>立即登录</a>`, 'popup')
      Popup.click('a.click', login)
      return
    }

    const nowTime = Math.floor(new Date().getTime() / 1000)
    if (nowTime < 1495279272) {
      Popup.alert(`<p>活动还未没开始哦！</p><a class='click'>知道了</a>`, 'popup')
      Popup.click('a.click')
      return
    }
    if (nowTime > 1495538472) {
      Popup.alert(`<p>活动已经结束啦~<br/>请关注现金卡其他活动吧</p><a class='click'>知道了</a>`, 'popup')
      Popup.click('a.click')
      return
    }

    if (tag === 1) {
      location.href = 'https://www.baidu.com/'
      return
    }

    if (tag === 0) {
      goCertification()
    }
  }

  render () {
    return (
      <div className='transition-group'>
        <div className='update'>
          <div className='content'>
            <div className='content-top public'>
              <img src='../../../../assets/img/activity/update/m_01.png' alt='' />
              <ul>
                <li>额度范围：<span className='span1'>1000-2000元</span></li>
                <li>借款周期：14天</li>
                <li>综合费率：<span className='span2'>0.71%</span>/天</li>
                <li>还款放式：一次性偿还本金</li>
              </ul>
            </div >
            <div className='content-middle public'>
              <img src='../../../../assets/img/activity/update/m_02.png' alt='' />
              <ul>
                <li>额度范围：<span className='span1'>2000-3000元</span></li>
                <li>借款周期：30天</li>
                <li>综合费率：<span className='span2'>0.40%</span>/天</li>
                <li>还款放式：一次性偿还本金</li>
              </ul>
            </div >
            <div className='content-bottom public'>
              <img src='../../../../assets/img/activity/update/m_03.png' alt='' />
              <ul>
                <li>额度范围：<span className='span1'>3000-5000元</span></li>
                <li>借款周期：90天</li>
                <li>综合费率：<span className='span2'>0.16%</span>/天</li>
                <li>还款放式：每月等额本息偿还</li>
              </ul>
            </div >
          </div >
          <button className='bt1' onClick={() => this.forward(1)}><span>你对产品有什么要说的?</span></button>
          <button className='bt2' onClick={() => this.forward(0)}><span>测信用 领分期卡</span></button>
        </div >
      </div >
    )
  }
}
