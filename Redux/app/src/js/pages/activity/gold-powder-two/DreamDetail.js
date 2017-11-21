import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, login, partake, platform, statistics } from 'utils'
import axios from 'axios'
import Dream from './Dream'
import 'scss/activity/gold-powder-two.component.scss'
let sUrl = ''
let page = ''

export default class DreamDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      main: {},
      code: 0
    }
    this.id = 0
  }

  componentWillMount () {
    this.fetchData()
  }

  fetchData () {
    Toast.loading('')
    this.id = this.props.location.query.id
    get(`http://credit.xianjincard.com//activity/golden-powder-care-act/wish-video-detail?id=${this.id}`).then(data => data.data).then(data => {
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
        main: data.data
      })
    })
  }

  video (img, link) {
    Popup.alert(Content.showVideo(img, link), 'popup-video')
  }

  render () {
    const {main} = this.state
    console.log(main)
    return (
      <div className='dream-detail'>
        <div className='top' ><h2><span>{main.video_title}</span>的心愿画面</h2></div>
        <div className='main'>
          <span className='top-bg' />
          <div className='con'>
            <img src={main.video_image_d1} />
            <img src={main.video_image_d2} />
            <div className='video-img' onClick={() => {
              this.video(main.video_image, main.video_link)
              statistics({
                type: 'goldPowderTwo',
                tag: `视频播放-${main.video_title}`
              })
            }}>
              <img src={main.video_image} />
            </div>
            <p>{main.video_desc}</p>
          </div>
          <span className='bottom-bg' />
        </div>

      </div>
    )
  }
}
