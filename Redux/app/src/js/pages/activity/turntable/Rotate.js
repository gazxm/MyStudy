import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { partake, get, platform, forwardApp } from 'utils'
import 'img/activity/turntable/shareIcon.png'

let rotateNum = 1
let rotateArr = [292.5, 202.5, 157.5, 112.5, 22.5]

export default class Rotate extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      rotate: 0
    }
  }

  rotate () {
    let { lotteryNumber, isLogin, locked, inviteCode, gold } = this.props.Turn.state
    if (!isLogin) {
      this.props.Turn.userLogin('1')
      return
    }
    if (locked) {
      if (!lotteryNumber) {
        if (platform.isWeixin) {
          Popup.alert(Content.noChanceHtml(1), 'popup')
        } else {
          Popup.alert(Content.noChanceHtml(0), 'popup')
        }
        Popup.click('a.click', () => {
          if (platform.isApp) {
            const shareUrl = `${location.protocol}//${location.host}/activity/turntable?invite_code=${inviteCode}`
            const shareImage = `${location.protocol}//${location.host}/assets/img/activity/turntable/shareIcon.png`
            partake({
              'share_title': '借款免息，还送iPhone7',
              'share_body': '快来这里，玩转现金卡',
              'share_url': shareUrl,
              'share_logo': shareImage
            })
            return
          }
          if (platform.isWeixin) {
            return
          }
          forwardApp()
        })
        return
      }
      this.props.Turn.setState({
        locked: 0
      })
      Toast.loading('')
      get(`http://credit.xianjincard.com/activity/turntable-act/prize-draw?tag=h5-20170327-turntableAct_act`).then(data => data.data).then(data => {
        Toast.hide()
        if (data.code === -1001) {
          this.props.Turn.userLogin('1')
          return
        }
        if (data.code === -2022) {
          Popup.alert(Content.popupHtml(`<p class="middle"><span>您今天已经抽过${data.data.limit}次了哦~<br />请明天再来吧！</span></p>`), 'popup popup-error')
          this.props.Turn.setState({
            locked: 1
          })
          return
        }
        if (data.code !== 0) {
          Popup.alert(Content.errorHtml(), 'popup popup-error')
          this.props.Turn.setState({
            locked: 1
          })
          return
        }
        this.props.Turn.setState({
          lotteryNumber: --lotteryNumber
        })
        let rotate = []
        switch (data.data.prize.type) {
          case 'deduction_ticket':
            rotate = rotateArr[0]
            break
          case 'temp_credit':
            rotate = rotateArr[1]
            break
          case 'cash_money':
            rotate = rotateArr[2]
            break
          case 'gold_score':
            rotate = rotateArr[3]
            break
          case 'free_ticket':
            rotate = rotateArr[4]
            break
        }
        this.setState({
          rotate: 1440 * rotateNum + rotate
        })
        rotateNum++
        setTimeout(() => {
          Popup.alert(Content.popupHtml(`<p class='middle'><span>亲，恭喜您抽中<b>${data.data.prize.title}</b>!<br />请去APP中<b>【我的】</b>查看哦！</span></p>`), 'popup popup-error')
          this.props.Turn.setState({
            locked: 1,
            arr: data.data.list
          })
          if (data.data.prize.type === 'gold_score') {
            this.props.Turn.setState({
              gold: parseInt(data.data.prize.title) + gold
            })
          }
        }, 4000)
      })
    }
  }

  render () {
    const { rotate } = this.state

    return (
      <div className='rotate-div'>
        <div className='rotate' style={{transform: `rotate(${rotate}deg)`, WebkitTransform: `rotate(${rotate}deg)`}} />
        <div className='pointer' onClick={this.rotate.bind(this)} />
      </div>
    )
  }
}
