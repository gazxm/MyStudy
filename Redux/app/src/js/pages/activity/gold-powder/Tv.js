import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, login, partake, platform, statistics } from 'utils'
import axios from 'axios'

let sUrl = ''
let page = ''

export default class Tv extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      batch: '1',
      main: {},
      index: [],
      pass: [],
      shareNum: 0,
      isLogin: 0,
      code: 0
    }
  }

  componentWillMount () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/golden-powder-care-act/video-index').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup')
        this.setState({
          code: data.code
        })
        if (data.code === -1001) {
          Popup.click('a.click', login)
          return
        }
        Popup.click('a.click')
        return
      }
      this.setState({
        batch: data.data.batch,
        index: data.data.index,
        main: data.data.main,
        pass: data.data.pass,
        shareNum: data.data.main.share,
        isLogin: data.data.is_login
      })
      page = data.data.main.id
    })
  }

  beforeButton () {
    const { code, isLogin } = this.state
    if (isLogin === 0) {
      Popup.alert(Content.showHtml(-1001), 'popup')
      Popup.click('a.click', login)
      return false
    }
    if (code !== 0) {
      Popup.alert(Content.showHtml(code), 'popup')
      Popup.click('a.click')
      return false
    }
    return true
  }

  upload () {
    statistics({
      type: 'goldPowder',
      tag: '上传视频'
    }).then(() => {
      location.href = 'http://xianjincard.mikecrm.com/MnUJFYr'
    })
  }

  up () {
    if (!this.beforeButton()) {
      return
    }
    const { main } = this.state
    Toast.loading('')
    get(`http://credit.xianjincard.com/activity/golden-powder-care-act/video-like?id=${main.id}`).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        if (data.code === -2025) {
          Toast.info('亲，您已经点过赞啦~', 2)
          return
        }
        Popup.alert(Content.showHtml(data.code, 'tv'), 'popup')
        if (data.code === -1001) {
          Popup.click('a.click', login)
          return
        }
        Popup.click('a.click')
        return
      }
      statistics({
        type: 'goldgoldPowder',
        tag: '点赞'
      })
      Toast.info('点赞成功', 2)
      this.setState({
        main: {
          ...this.state.main,
          like: data.data.like,
          my_like: 1
        }
      })
    })
  }

  share () {
    Toast.loading('')
    get(`http://credit.xianjincard.com/activity/default/wx-share-api?key=GoldVideo&akey=goldenPowderCare_act`).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) return
      sUrl = data.data.successUrl
      partake({
        'share_title': data.data.title,
        'share_body': data.data.desc,
        'share_url': data.data.url,
        'share_logo': data.data.icon,
        'platform': 'WEIXIN,WEIXIN_CIRCLE,QQ,QZONE,SINA',
        'callback': 'shareCb'
      })
    })
  }

  pass () {
    const { pass } = this.state
    Popup.alert(Content.passVideo(pass), 'popup-rule')
  }

  video (img, link) {
    Popup.alert(Content.showVideo(img, link), 'popup-video')
  }

  render () {
    const { index, main, batch, shareNum } = this.state

    const content = index.length > 0 ? index.map((v, i) =>
      <div className='video-small' key={i} onClick={() => this.video(v.image, v.link)}>
        <img src={v.image} alt={v.title} />
        <h3>{v.title}</h3>
      </div>
    ) : null

    return (
      <div className='tv'>
        <h1>金粉剧场<br />第{batch}期</h1>
        <a className='pass' onClick={this.pass.bind(this)} />
        <div className='video-header' onClick={() => this.video(main.image, main.link)}>
          <img src={main.image} alt={main.title} />
          <h3>{main.title}</h3>
        </div>
        <a className={main.my_like ? 'up' : 'up gray'} onClick={this.up.bind(this)}>{main.like}</a>
        {platform.isApp ? <a className='share' onClick={this.share.bind(this)}>{shareNum}</a> : null}
        <div className='video-content'>
          {content}
        </div>
        <a className='upload' onClick={this.upload.bind(this)}>上传你的视频</a>
      </div>
    )
  }
}

window.shareCb = function (platform, device) {
  if (sUrl !== '') {
    axios.get(`${sUrl}&page=${page}&source=${device}`).then(data => data.data).then(data => {})
  }
}
