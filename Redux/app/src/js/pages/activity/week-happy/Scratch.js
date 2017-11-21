import React from 'react'
import Lottery from '../components/Lottery'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, share, login, goHome, goCertification, statistics } from 'utils'
import 'scss/activity/week.component.scss'
import 'img/activity/scratch-card/scratch-04.jpg'

const totalLength = 7
let rewardFlag = 1
let toastFlag = 1
let width = 0
let height = 0
export default class Scratch extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      scratchDisplay: 'hide',
      bannerDisplay: 'show',
      loginFlag: 1

    }
  }

  componentDidMount () {

  }

  componentDidUpdate () {
    width = document.getElementsByClassName('canvas')[0].offsetWidth
    height = document.getElementsByClassName('canvas')[0].offsetHeight

    this.init()
  }

  init () {
    let text = '太遗憾了,没有中奖'
    Lottery.init(this.refs.lotteryContainer, '/assets/img/activity/scratch-card/scratch-04.jpg', 'image', width, height, 30, 60, text, 'text', this.scratch.bind(this))
  }

  scratch (per) {
    if (per > 35 && rewardFlag) {
      rewardFlag = 0
      Toast.loading('')
      get('http://credit.xianjincard.com/activity/scratch-act/scratch?tag=h5-20170526-scratch_act').then(data => data.data).then(data => {
        Toast.hide()
        if (data.code !== 0) {
          Popup.alert(Content.showHtml(data.code), 'popup-show')
          if (data.code === -1001) {
            this.setState({
              loginFlag: 0
            })
            Popup.click('a.click', login)
            return
          }
          if (data.code === -2022) {
            Popup.click('a.click', goHome)
            return
          }
          if (data.code === -2024) {
            Popup.click('a.click', () => {
              this.init()
              rewardFlag = 1
            })
            return
          }
          Popup.click('a.click')
          return
        }
        // Popup.alert(Content.rewardHtml(data.data, platform.isApp), 'popup-reward')
        this.setState({

        })
      })
    }
    if (per < 35 && toastFlag) {
      toastFlag = 0
      Toast.info('请在多刮一点哦', 2)
      setTimeout(() => {
        toastFlag = 1
      }, 2200)
    }
  }
  showPic () {
    this.setState({scratchDisplay: 'show', bannerDisplay: 'hide'})
  }
  render () {
    let imgUrl = '/assets/img/activity/week/scratch-banner.png'
    const { bannerDisplay, scratchDisplay } = this.state
    return (
      <div className='scratch'>
        <a className={bannerDisplay} onClick={this.showPic.bind(this)}> <img src={imgUrl} />点击刮奖</a>
        <div className={`canvas-content ${scratchDisplay}`}>
          <div ref='lotteryContainer' className='canvas' />
        </div>
      </div>
    )
  }
}
