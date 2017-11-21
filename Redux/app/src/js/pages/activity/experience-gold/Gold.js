import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import { get, login, goHome, platform } from 'utils'
import Toast from '../../../components/Toast'

import 'scss/activity/experience-gold.component.scss'

const appMarket = 'goldCard'
export default class Gold extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      num: 0
    }
  }

  componentDidMount () {
    document.title = '体验金卡'
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/experience-gold-act/index').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.popupHtml(), 'popup')
        Popup.click('a.click')
        return
      }
      this.setState({
        num: data.data.numb
      })
    })
  }

  receive () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/experience-gold-act/get-experience?tag=h5-20170410-experienceGold_act').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0 && data.code !== -2025) {
        if ((platform.version === '1.4.8' || platform.version === '1.4.9') && platform.isIos) {
          Popup.alert(Content.errorHtml(-2004), 'popup')
        } else {
          Popup.alert(Content.errorHtml(data.code), 'popup')
        }
        if (data.code === -1001) {
          Popup.click('a.click', () => { login(appMarket) })
          return
        }
        if (data.code === -2003) {
          if ((platform.version === '1.4.8' || platform.version === '1.4.9') && platform.isIos) {
            Popup.click('a.click')
            return
          }
          Popup.click('a.click', () => { goHome() })
          return
        }
        Popup.click('a.click')
        return
      }
      Popup.alert(Content.errorHtml(data.code), 'popup')
      Popup.click('a.click', () => {
        goHome()
      })
    })
  }

  render () {
    const { num } = this.state

    return (
      <div className='transition-group'>
        <div className='gold'>
          <p className='num'>已领取体验金卡人数<b>{num}</b></p>
          <a onClick={this.receive.bind(this)}>领取体验金卡</a>
          <div className='rule'>
            <h3><span>体验金卡攻略</span></h3>
            <p className='p-head'>Q1.领取体验金卡时间？</p>
            <p>2017年4月10日15:00-4月30日24:00</p>
            <p className='p-head'>Q2.体验金卡服务优势有哪些?</p>
            <p>借款使用周期长达21天<br />综合服务费相比白卡降低了25%</p>
            <p className='p-head'>Q3.体验金卡有效期多少天？</p>
            <p>体验金卡自领取之日起3天内有效</p>
            <p className='p-head'>Q4.您想有机会长期持有金卡吗？</p>
            <p>1.完整填写高级认证项<br />2.至少填写加分认证项1项<br />3.以上项完成后，最终获得与否由本司风控部门审核决定，当然完善更多信息及良好的还款记录有助于提高通过率</p>
            <p className='center'>本活动最终解释权为现金卡所有，与apple.Inc无关</p>
          </div>
        </div>
      </div>
    )
  }
}
