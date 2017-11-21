import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { partake, get, platform, forwardApp, goCoupon } from 'utils'
import 'img/activity/turntable/shareIcon.png'

const animArr = [0, 1, 2, 4, 7, 6, 5, 3]
let animInterval = null
let animTime = 10
let start = 0

export default class Rotate extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      anim: [],
      data: {}
    }
  }

  reward () {
    let { lotteryNumber, isLogin, locked, inviteCode } = this.props.Turn.state
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
            const shareUrl = `${location.protocol}//${location.host}/activity/turntable-two?invite_code=${inviteCode}`
            const shareImage = `${location.protocol}//${location.host}/assets/img/activity/turntable-two/shareIcon.png`
            partake({
              'share_title': '借款返现，还送iPhone7',
              'share_body': '通过我的邀请注册，1分钟认证，20分钟到账，被拒还有现金赔偿！',
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
          Popup.alert(Content.popupHtml(`<p class="middle"><span>您今天已经抽过${data.data.limit}次了哦~<br />请明天再来吧！</span></p>`), 'popup')
          this.props.Turn.setState({
            locked: 1
          })
          return
        }
        if (data.code !== 0) {
          Popup.alert(Content.errorHtml(), 'popup')
          this.props.Turn.setState({
            locked: 1
          })
          return
        }
        this.props.Turn.setState({
          lotteryNumber: --lotteryNumber
        })
        let end = 0
        switch (data.data.prize.type) {
          case 'deduction_ticket':
            end = animArr[5]
            break
          case 'temp_credit':
            end = animArr[2]
            break
          case 'cash_money':
            end = animArr[4]
            break
          case 'gold_score':
            end = animArr[6]
            break
          case 'free_ticket':
            end = animArr[0]
            break
        }
        animTime = 30
        animInterval = setInterval(() => {
          this.rotate(start, end)
          start = end
        }, animTime)
        this.setState({
          data: data.data
        })
      })
    }
  }

  rotate (animFlag, rewardFlag) {
    if (animTime > 400 && animFlag === rewardFlag) {
      const { data } = this.state
      const { gold } = this.props.Turn.state
      clearInterval(animInterval)
      if (animFlag === 0 || animFlag === 2) {
        let arr = new Array(8)
        arr[animArr[animFlag]] = 'active'
        this.setState({
          anim: arr
        })
        setTimeout(() => {
          if (data.prize.type === 'deduction_ticket' || data.prize.type === 'temp_credit' || data.prize.type === 'free_ticket') {
            Popup.alert(Content.popupHtml(`<p class='middle'><span>亲，恭喜您抽中<b>${data.prize.title}</b>!</p><a class='click'>立即查看</a>`), 'popup')
            Popup.click('a.click', goCoupon)
          } else {
            Popup.alert(Content.popupHtml(`<p class='middle'><span>亲，恭喜您抽中<b>${data.prize.title}</b>!<br />请去APP中<b>【我的】</b>查看哦！</span></p>`), 'popup')
          }
        }, 700)
      } else {
        if (data.prize.type === 'deduction_ticket' || data.prize.type === 'temp_credit' || data.prize.type === 'free_ticket') {
          Popup.alert(Content.popupHtml(`<p class='middle'><span>亲，恭喜您抽中<b>${data.prize.title}</b>!</p><a class='click'>立即查看</a>`), 'popup')
          Popup.click('a.click', goCoupon)
        } else {
          Popup.alert(Content.popupHtml(`<p class='middle'><span>亲，恭喜您抽中<b>${data.prize.title}</b>!<br />请去APP中<b>【我的】</b>查看哦！</span></p>`), 'popup')
        }
      }
      this.props.Turn.setState({
        locked: 1,
        arr: data.list
      })
      if (data.prize.type === 'gold_score') {
        this.props.Turn.setState({
          gold: parseInt(data.prize.title) + gold
        })
      }
      return
    }
    clearInterval(animInterval)
    let arr = new Array(8)
    arr[animArr[animFlag]] = 'active'
    this.setState({
      anim: arr
    })
    animFlag++
    if (animFlag > 7) {
      animFlag = 0
    }
    animTime *= 1.1
    animInterval = setInterval(() => this.rotate(animFlag, rewardFlag), animTime)
  }

  render () {
    const { anim } = this.state

    return (
      <div className='rotate'>
        <div className='rotate-content'>
          <ul className='clearfix'>
            <li className={anim[0] ? `${anim[0]}` : ''}><span><i />返现券</span></li>
            <li className={anim[1] ? `${anim[1]}` : ''}><span><i />iphone7 128G</span></li>
            <li className={anim[2] ? `${anim[2]}` : ''}><span><i />提额券</span></li>
            <li className={anim[3] ? `${anim[3]}` : ''}><span><i />100M流量</span></li>
            <a className='reward' onClick={this.reward.bind(this)} />
            <li className={anim[4] ? `${anim[4]}` : ''}><span><i />金条10g</span></li>
            <li className={anim[5] ? `${anim[5]}` : ''}><span><i />现金红包</span></li>
            <li className={anim[6] ? `${anim[6]}` : ''}><span><i />抵扣券</span></li>
            <li className={anim[7] ? `${anim[7]}` : ''}><span><i />金币</span></li>
          </ul>
        </div>
      </div>
    )
  }
}
