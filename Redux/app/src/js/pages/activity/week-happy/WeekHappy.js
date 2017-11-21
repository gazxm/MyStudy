import React from 'react'
import {Carousel} from 'antd-mobile'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, platform, resolveUrl, login } from 'utils'
import 'scss/activity/week.component.scss'

let timerInterval = null
export default class WeekHappy extends React.Component {
  constructor (props) {
    super(props)
    this.bannerData = []
    this.newUserData = []
    this.severTimeSpan = 0
    this.videoStartTime = 1504368000 // 2017年09月2日24时
    this.state = {}
  }
  componentWillUnmount () {
    clearInterval(timerInterval)
  }
  componentDidMount () {
    document.title = '周周乐'
    this.initData()
  }
  getCurTime () {
    return Math.floor(new Date().getTime() / 1000) + this.severTimeSpan
  }
  initData () {
    Toast.loading('')
    this.videoArea()
    get('http://credit.xianjincard.com/activity/privilege-act/index').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code != 0) {
        Toast.info(data.message, 2)
        return
      }

        // banner区
      this.bannerData = data.data.banner.map((ele, index) => {
        return (<div key={index} className='banner-item' ><img src={ele.imgUrl} /> </div>)
      })

      this.setState({isInit: true})
      // this.severTimeSpan = parseInt(data.data.data.cur_time) - parseInt(new Date().getTime() / 1000)
    })
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
  showVideo () {
    Popup.alert(Content.showVideo(), 'popup-video')
  }
  videoArea () {
    const nowTime = this.getCurTime()
    if (nowTime >= this.videoStartTime) {
      this.setState({
        timerText: `<a onClick={this.showVideo.bind(this)}>开奖视频 </a>`
      })
    }
    this.startTimer()
  }
  startTimer () {
    let timer = () => {
      let nowTime = this.getCurTime()
      let leftTime = this.videoStartTime - nowTime
      let d = Math.floor(leftTime / 60 / 60 / 24),
        h = d * 24 + Math.floor(leftTime / 60 / 60 % 24),
        m = Math.floor(leftTime / 60 % 60),
        s = Math.floor(leftTime % 60),
        newh = (h.toString().length < 2) ? '0' + h : h,
        newm = (m.toString().length < 2) ? '0' + m : m,
        news = (s.toString().length < 2) ? '0' + s : s

      this.setState({
        timerText: `<span><b>${newh}</b>:<b>${newm}</b>:<b>${news}</b></span>`
      })

      if (nowTime >= this.videoStartTime) {
        // 关闭定时器 停止倒计时
        clearInterval(that.timerInterval)
      }
    }
    this.timerInterval = setInterval(timer, 1000)
  }
  render () {
    let iconUrl = '/assets/img/activity/week/card-icon.png'
    let imageUrl = '/assets/img/activity/week/card-bg1.png'

    return (
      <div className='transition-group'>
        <a className='right-top-btn'>开奖查询</a>
        <div className='week-happy'>
          <div className='banner-wrapper'>
            <Carousel infinite>
              {this.bannerData}
            </Carousel>
            <div className='video-meta'>
              <p><span className='timer' dangerouslySetInnerHTML={{__html: this.state.timerText}} /><br />本期参与人数：<b>5666</b></p>
            </div>
          </div>
          <ul className='prizer'>
            <li>一等奖：1888元，XXX获得</li>
            <li>一等奖：1888元，XXX获得</li>
            <li>一等奖：1888元，XXX获得</li>
            <li>一等奖：1888元，XXX获得</li>
          </ul>
          <dl className='card-list'>
            <dt><button onClick={() => { Popup.alert(Content.showRule(), 'popup-rule') }}>详细规则 </button>20170804期 (共X注） </dt>
            <dd>
              <span>第1注(未中奖)</span>
              <div className='card-wrapper'>
                <a /><a /><a /><a onClick={this.showCardDetail.bind(this)} style={{backgroundImage: `url(${imageUrl})`}}><img src={iconUrl} /><b>特权营</b></a>
              </div>
            </dd>
            <dd className='win'>
              <span>第2注(已中奖)</span>
              <div className='card-wrapper'>
                <a /><a /><a /><a onClick={this.showCardDetail.bind(this)} style={{backgroundImage: `url(${imageUrl})`}}><img src={iconUrl} /><b>特权营</b></a>
              </div>
              <button onClick={this.showWinning.bind(this)}>中奖详情</button>
            </dd>
          </dl>
          <button className='btn' onClick={() => { location.href = resolveUrl('http://h.xianjincard.com/activity/week-happy/gold-exchange') }}>金币兑换周周乐</button>
          <a className='link'onClick={() => { location.href = resolveUrl('http://h.xianjincard.com/activity/week-happy/my-history') }}>已获得的周周乐</a>
        </div>
      </div>
    )
  }
}
