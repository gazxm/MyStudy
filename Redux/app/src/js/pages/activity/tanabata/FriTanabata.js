import React from 'react'
import Content from './Content'
import Effect from './Effect'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, login, platform, resolveUrl } from 'utils'
import 'scss/activity/tanabata.component.scss'

export default class FriTanabata extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      sign: false,
      shareBtn: false,  // 分享按钮初始不显示
      fingerAreaClass: 'img1',
      lineClass: '',
      tipsTxt: `按下指纹就知道你和TA之间<br />亲密指数到底有多少`,
      code: 0,
      message: ''
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
        this.setState({
          code: response.code,
          message: response.message
        })
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
    })
  }

  // 手指按下录指纹
  markFinger () {
    const { code, message } = this.state
    // 如果已经录入完成, 则不处理
    if (this.state.shareBtn) {
      return
    }

    if (code !== 0) {
      Popup.alert(Content.popupHtml(message), 'popup')
      Popup.click('a.click')
      return
    }

    // onTouchStart
    this.timeOutId = setTimeout(() => {
      this.countdownNumber = 6  // 11
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
        this.setState({
          shareBtn: true,
          tipsTxt: ` 录入完成`,
          fingerAreaClass: 'img5',
          lineClass: ''
        })
      }, 1000)

      setTimeout(() => {
        Toast.loading('')
        const { query } = this.props.location
        get(`http://credit.xianjincard.com/activity/valentine-day-act/get-pic?sign=${query.sign}`).then(data => data.data).then(response => {
          Toast.hide()
          if (!this.wxShouquan(response.code)) {
            return
          }
          if (response.code !== 0) {
            if (response.code === -1001) {
              login()
              return
            }
            if (response.code === -2025) {
              Popup.alert(Content.popupHtml(response.message, '查看指数'), 'popup')
              Popup.click('a.click', () => {
                location.href = resolveUrl('http://h.xianjincard.com/activity/tanabata')
              })
              return
            }
            if (response.code === -2040) {
              Popup.alert(Content.showRed(), 'popup-red')
              Popup.click('a.click', forwardApp)
              this.setState({
                code: response.code
              })
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
        })
      }, 6000)
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

  // 查看指数
  seeZhishu () {
    const { query } = this.props.location
    const { code, message } = this.state
    if (code !== 0) {
      if (code === -2040) {
        Popup.alert(Content.showRed(), 'popup-red')
        Popup.click('a.click', forwardApp)
        return
      }
      Popup.alert(Content.popupHtml(message), 'popup')
      Popup.click('a.click')
      return
    }
    Toast.loading('')
    get(`http://credit.xianjincard.com/activity/valentine-day-act/my-pics?sign=${query.sign}`).then(data => data.data).then(response => {
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
      Popup.alert(Content.showCard('friTanabata', response.data.pics.pics, response.data.pics.wx_pic, response.data.pics.close_index, response.data.pics.percent, parseInt('4')), 'popup-card fri')
      Popup.click('button.blue-btn', () => { window.location.href = resolveUrl('http://h.xianjincard.com/activity/tanabata') })
    })
  }
  render () {
    const {fingerAreaClass, lineClass, tipsTxt, shareBtn} = this.state
    return (
      <div className='transition-group'>
        <div className='tanabata '>
          <Effect />
          <span className='tit' />
          <div className='launch' >
            <p className='tips' dangerouslySetInnerHTML={{__html: tipsTxt}} />
            <div className='finger'>
              {platform.isWeixin ? <div><div className={lineClass} /> <span className={fingerAreaClass} onTouchStart={() => this.markFinger()} onTouchEnd={() => this.markFingerLeave()} /> </div> : <span className={fingerAreaClass} onClick={() => { this.goFollow() }} /> }
            </div>
            <button className={shareBtn ? 'share-btn' : 'share-btn none'} onClick={() => { this.seeZhishu() }}>查看指数</button>
            <p className='meta mart'>关注微信公众号“xianjinbaika"<br />即可实时查看指数结果</p>
          </div>

        </div>
      </div>
    )
  }
}
