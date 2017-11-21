import React from 'react'
import Content from './Content'
import Effect from './Effect'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, share, platform, resolveUrl, login, forwardApp } from 'utils'
import 'scss/activity/tanabata.component.scss'

let TanaSucFlag = true

export default class Tanabata extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      sign: false,
      shareBtn: false,
      myZhishu: false,
      fingerAreaClass: 'img1',
      lineClass: '',
      tipsTxt: `按下指纹就知道你和TA之间<br />亲密指数到底有多少`,
      sharePopup: true
    }
  }
  componentWillMount () {
    this.fetchData()
  }
  componentDidMount () {
    document.title = '我的心里“指”有你'
  }
  // 微信授权
  wxShouquan (code) {
    if (code === -1001) {
      location.href = resolveUrl('http://credit.xianjincard.com/wx/user-auth-template?redirectUrl=' + encodeURIComponent(location.href))
      return false
    }
    return true
  }
  fetchData () {
    Toast.loading('')
    get(`http://credit.xianjincard.com/activity/valentine-day-act/index`).then(data => data.data).then(response => {
      Toast.hide()
      if (!this.wxShouquan(response.code)) {
        return
      }
      if (response.code !== 0) {
        if (response.code === -1001) {
          login()
          return
        }
        Popup.alert(Content.popupHtml(response.message), 'popup')
        Popup.click('a.click')
      }
      this.setState({
        sign: response.data.sign,
        share: response.data.share,
        login: response.data.login
      })
      if (typeof response.data.is_complete !== 'undefined' && parseInt(response.data.is_complete) !== 0) {
        Popup.alert(Content.showRed(), 'popup-red')
        Popup.click('a.click', forwardApp)
        return
      }
      if (response.data.sign) {
        this.setState({myZhishu: true})
        share('tanabata', {sign: response.data.sign})
      } else {
        share('tanabataNo')
      }
    })
    // 用户分享成功执行的回调函数 提交sign
    window.shareSuc = () => {
      // if (window.localStorage.getItem('TanaSucFlag') === false) {
      //   TanaSucFlag = window.localStorage.getItem('TanaSucFlag')
      // }
      if (TanaSucFlag) {
        Toast.loading('')
        get(`http://credit.xianjincard.com/activity/valentine-day-act/get-pic?sign=${this.state.sign}&source=1`).then(data => data.data).then(response => {
          Toast.hide()
          // window.localStorage.setItem('TanaSucFlag', false)
          if (!this.wxShouquan(response.code)) {
            return
          }
          if (response.code !== 0) {
            if (response.code === -1001) {
              login()
              return
            }
            if (response.code === -2025) {
              this.mycards(3)
              return
            }
            if (response.code === -2040) {
              Popup.alert(Content.showRed(), 'popup-red')
              Popup.click('a.click', forwardApp)
              return
            }
            Popup.alert(Content.popupHtml(response.message), 'popup')
            Popup.click('a.click')
            return
          }
          if (typeof response.data.is_complete !== 'undefined' && parseInt(response.data.is_complete) !== 0) {
            Popup.alert(Content.showRed(), 'popup-red')
            Popup.click('a.click', forwardApp)
            return
          }
          this.mycards(1)
        })
      } else {
        this.mycards(3)
      }
    }
  }
  // 分享成功后获取我的卡片列表
  mycards (type) {
    Toast.loading('')
    get(`http://credit.xianjincard.com/activity/valentine-day-act/my-pics`).then(data => data.data).then(response => {
      Toast.hide()
      if (!this.wxShouquan(response.code)) {
        return
      }
      if (response.code !== 0) {
        if (response.code === -1001) {
          login()
          return
        }
        Popup.alert(Content.popupHtml(response.message), 'popup')
        Popup.click('a.click')
        return
      }
      Popup.alert(Content.showCard('', response.data.pics.pics, response.data.pics.wx_pic, null, null, type), 'popup-card')
      Popup.click('button.blue-btn', () => { this.setState({myZhishu: true}) })
    })
  }

  markFinger2 () {
    this.goFollow()
  }

  // 手指按下录指纹
  markFinger () {
    // 如果已经录入完成, 则不处理
    if (this.state.shareBtn) {
      return
    }

    // onTouchStart
    this.timeOutId = setTimeout(() => {
      this.countdownNumber = 6   // 11
      this.intervarId = setInterval(() => {
        this.countdownNumber--

        if (this.countdownNumber > 0) {
          this.setState({
            tipsTxt: `剩下 ${this.countdownNumber} 秒 <br/>完成录入`,
            fingerAreaClass: 'img2',
            lineClass: 'line'
          })
          return
        }

        clearInterval(this.intervarId)

        console.log('长按倒计时结束')

        this.setState({
          shareBtn: true,
          tipsTxt: ` 录入完成`,
          fingerAreaClass: 'img5',
          lineClass: ''
        })
      // 真正长按后应该执行的内容
        if (this.state.sign) {
          return
        }
        Toast.loading('')
        get(`http://credit.xianjincard.com/activity/valentine-day-act/launch`).then(data => data.data).then(response => {
          Toast.hide()
          if (!this.wxShouquan(response.code)) {
            return
          }
          if (response.code !== 0) {
            if (response.code === -1001) {
              login()
              return
            }
            Popup.alert(Content.popupHtml(response.message), 'popup')
            Popup.click('a.click')
          }
          this.setState({
            sign: response.data.sign
          })
          share('tanabata', {sign: response.data.sign})
        })
      }, 1000)

      console.log('手机长按事件')
    }, 100) // 超过100ms则视为长按`
  }
  // 手指离开
  markFingerLeave () {
    // onTouchEnd

    clearTimeout(this.timeOutId)// 清除定时器

    clearInterval(this.intervarId)

    // 未录入完成， 则显示默认提示
    if (this.state.shareBtn == false) {
      this.setState({
        tipsTxt: `按下指纹就知道你和TA之间<br />亲密指数到底有多少`,
        lineClass: ''
      })
    }
  }
  // 跳转至关注微信提示页
  goFollow () {
    location.href = resolveUrl('http://h.xianjincard.com/activity/tanabata/follow')
  }

  showRule () {
    Popup.alert(Content.showRule(), 'popup-rule')
  }
  showShareGuid () {
    // 显示分享引导覆层
    this.setState({
      sharePopup: false
    })
    // 分享成功后 test
    // this.mycards()
  }
  hideShareGuid () {
    this.setState({
      sharePopup: true
    })
  }
  tostTips () {
    Toast.info(`长按录指纹哦~`, 2)
    return false
  }
  goViewAll () {
    const { sign } = this.state
    window.sessionStorage.setItem('tanabataHref', location.href)
    this.state.login === 0 ? location.href = resolveUrl('http://h.xianjincard.com/activity/tanabata/register') : location.href = resolveUrl(`http://h.xianjincard.com/activity/tanabata/viewAll?sign=${sign}`)
  }
  render () {
    const {fingerAreaClass, lineClass, tipsTxt, myZhishu, shareBtn, sharePopup} = this.state
    return (
      <div className='transition-group'>
        <div className='tanabata '>
          <Effect />
          <span className='tit' />
          {myZhishu == false ? (<div>
            <div className='launch' >
              <p className='tips' dangerouslySetInnerHTML={{__html: tipsTxt}} />
              <div className='finger'>
                {platform.isWeixin ? <div><div className={lineClass} /><span className={fingerAreaClass} onTouchStart={() => this.markFinger()} onTouchEnd={() => this.markFingerLeave()} onClick={() => { this.tostTips() }} /></div>
                 : <span className={fingerAreaClass} onClick={() => { this.goFollow() }} onTouchStart={() => this.markFinger2()} /> }

              </div>
              <button className={shareBtn ? 'share-btn' : 'share-btn none'} onClick={() => { this.showShareGuid() }}>发给TA</button>
              <a className='show-rule' onClick={this.showRule.bind(this)}>游戏规则</a> <p className='meta'>每测一个指纹就可以获得卡片<br />集齐“祝七夕情人节快乐”即可获得<b>77元</b>现金红包</p>
            </div>
          </div>) : (<div className='launch myZhishu' >
            <div className='finger'>
              <span className='img3' />
            </div>
            <button className='share-btn' onClick={() => this.goViewAll()}>查看指数</button>
            <button className='share-btn' onClick={() => this.showShareGuid()}>发给好友</button>
            <a className='show-rule' onClick={() => this.mycards(2)}>查看卡片</a> <p className='meta'>每测一个指纹就可以获得卡片<br />集齐“祝七夕情人节快乐”即可获得<b>77元</b>现金红包</p>
          </div>)}
        </div>
        <div className={`popup-guid ${sharePopup ? 'hide' : ''}`} onClick={this.hideShareGuid.bind(this)}>
          <div className='overlay' />
          <div className='content' />
        </div>
      </div>
    )
  }
}
