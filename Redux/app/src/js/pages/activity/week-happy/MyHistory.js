import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import { get, platform, redirect, login } from 'utils'
import 'scss/activity/week.component.scss'

export default class MyHistory extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    document.title = '已获得的周周乐'
  }
  showCardDetail () {
    let iconUrl = '/assets/img/activity/week/card-icon.png'
    let imageUrl = '/assets/img/activity/week/card-bg1big.png'
    let tit = '特权营'
    let tips = '特权营为现金卡为会员提供服务特权营为现金卡为会员提供服务特权营为现金卡为会员提供服务。'
    Popup.alert(Content.showCard(imageUrl, iconUrl, tit, tips), 'popup popup-card')
  }
  showWinning () {
    Popup.alert(Content.showWinningDetail(), 'popup-win')
  }
  render () {
    let iconUrl = '/assets/img/activity/week/card-icon.png'
    let imageUrl = '/assets/img/activity/week/card-bg1.png'
    return (
      <div className='transition-group'>
        <a className='right-top-btn' onClick={() => { location.href = resolveUrl('http://h.xianjincard.com/activity/week-happy/award-history') }}>开奖查询</a>
        <div className='my-history'>
          <dl className='card-list'>
            <dt> <b>20170804期</b> (已开奖） </dt>
            <dd>
              <span>第1注(未中奖)</span>
              <div className='card-wrapper'>
                <a /><a /><a /><a onClick={this.showCardDetail.bind(this)} style={{backgroundImage: `url(${imageUrl})`}}><img src={iconUrl} /><b>特权营</b></a>
              </div>
            </dd>
            <dd className='win'>
              <span>第1注(已中奖)</span>
              <div className='card-wrapper'>
                <a /><a /><a /><a onClick={this.showCardDetail.bind(this)} style={{backgroundImage: `url(${imageUrl})`}}><img src={iconUrl} /><b>特权营</b></a>
              </div>
              <button onClick={this.showWinning.bind(this)}>中奖详情</button>
            </dd>
          </dl>
        </div>
      </div>
    )
  }
}
