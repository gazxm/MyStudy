import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import { get, platform, redirect, login } from 'utils'
import 'scss/activity/week.component.scss'

export default class AwardHistory extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    document.title = '开奖查询'
  }
  showCardDetail () {
    let iconUrl = '/assets/img/activity/week/card-icon.png'
    let imageUrl = '/assets/img/activity/week/card-bg1big.png'
    let tit = '特权营'
    let tips = '特权营为现金卡为会员提供服务特权营为现金卡为会员提供服务特权营为现金卡为会员提供服务。'
    Popup.alert(Content.showCard(imageUrl, iconUrl, tit, tips), 'popup popup-card')
  }
  render () {
    let iconUrl = '/assets/img/activity/week/card-icon.png'
    let imageUrl = '/assets/img/activity/week/card-bg1.png'
    return (
      <div className='transition-group'>
        <a className='right-top-btn' onClick={() => { location.href = resolveUrl('http://h.xianjincard.com/activity/week-happy/rule') }}>详情规则</a>
        <div className='award-history'>
          <dl className='card-list'>
            <dt> <b>20170804期</b> (已开奖） </dt>
            <dd>
              <span>开奖结果</span>
              <div className='card-wrapper'>
                <a /><a /><a /><a onClick={this.showCardDetail.bind(this)} style={{backgroundImage: `url(${imageUrl})`}}><img src={iconUrl} /><b>特权营</b></a>
              </div>
              <div className='prizer'>
                <p>一等奖<br /><i>1888元</i><br /><b>233人</b></p>
                <p>一等奖<br /><i>1888元</i><br /><b>233人</b></p>
                <p>一等奖<br /><i>1888元</i><br /><b>233人</b></p>
                <p>一等奖<br /><i>下期周周乐1注</i><br /><b>233人</b></p>
              </div>
            </dd>
          </dl>
          <dl className='card-list'>
            <dt> <b>20170804期</b> (已开奖） </dt>
            <dd>
              <span>开奖结果</span>
              <div className='card-wrapper'>
                <a /><a /><a /><a onClick={this.showCardDetail.bind(this)} style={{backgroundImage: `url(${imageUrl})`}}><img src={iconUrl} /><b>特权营</b></a>
              </div>
              <div className='prizer'>
                <p>一等奖<br /><i>1888元</i><br /><b>233人</b></p>
                <p>一等奖<br /><i>1888元</i><br /><b>233人</b></p>
                <p>一等奖<br /><i>1888元</i><br /><b>233人</b></p>
                <p>一等奖<br /><i>下期周周乐1注</i><br /><b>233人</b></p>
              </div>
            </dd>
          </dl>
        </div>
      </div>
    )
  }
}
