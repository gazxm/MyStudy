import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, login, partake, platform, statistics, redirect } from 'utils'
import axios from 'axios'
import 'scss/activity/gold-powder-two.component.scss'
let sUrl = ''
let page = ''

export default class Dream extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      list: [],
      code: 0,
      isLogin: 0
    }
  }

  componentWillMount () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/golden-powder-care-act/wish-video').then(data => data.data).then(reaponse => {
      Toast.hide()
      if (reaponse.code !== 0) {
        Popup.alert(Content.showHtml(reaponse.code), 'popup')
        this.setState({
          code: reaponse.code
        })
        if (reaponse.code === -1001) {
          Popup.click('a.click', login)
          return
        }
        Popup.click('a.click')
        return
      }
      this.setState({
        list: reaponse.data.index,
        isLogin: reaponse.data.is_login
      })
    })
  }
  goDetail (video_id) {
    redirect.push(`http://credit.xianjincard.com/activity/gold-powder-two/dream-detail?id=${video_id}`)
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
  up (videoId, i) {
    if (!this.beforeButton()) {
      return
    }
    const { list } = this.state
    Toast.loading('')
    get(`http://credit.xianjincard.com/activity/golden-powder-care-act/video-like?id=${videoId}`).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        return
      }
      list[i].video_like = data.data.like
      list[i].my_like = data.data.my_like
      console.log(videoId, i)
      this.setState({
        list: list
      })
      if (this.state.list[i].my_like) {
        Toast.info('点赞成功', 2)
        statistics({
          type: 'goldPowderTwo',
          tag: `点赞-${list[i].user_name}`
        })
        return
      }
      statistics({
        type: 'goldPowderTwo',
        tag: `取消点赞-${list[i].user_name}`
      })
      Toast.info('取消点赞成功', 2)
    })
  }

  render () {
    const { list } = this.state
    const content = list.length > 0 ? list.map((v, i) =>
      <li key={i} >
        <img src={v.head_img} alt={v.title} />
        <div className='group'>
          <p>{v.user_name}<span>（i帮第{v.batch}期入选用户）</span><br />i帮心愿：{v.wish_text}</p>
          <button onClick={() => {
            statistics({
              type: 'goldPowderTwo',
              tag: `按钮-${v.user_name}`
            })
            this.goDetail(v.video_id)
          }}>i帮心愿实现画面</button>
        </div>
        <div className={v.my_like ? 'thumbs-up' : 'thumbs'} onClick={() => this.up(v.video_id, i)}> {v.video_like } </div>
      </li>
    ) : null

    return (
      <div className='dream'>
        <div className='list-wrapper'>
          <ul>
            {content}
          </ul>
        </div>
        <p className='txt'>谢谢大家，让我们感到自己做出的努力，得到了认可，接下来我们会更努力，让大家更满意！</p>
      </div>
    )
  }
}
