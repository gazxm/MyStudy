import React from 'react'
import Content from './Content'
import { Modal } from 'antd-mobile'
import Toast from '../../../components/Toast'
import Popup from '../components/Popup'
import { get, platform, redirect, login } from 'utils'
import 'scss/activity/week.component.scss'

export default class GoldExchange extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    document.title = '周周乐'
  }

  // 兑换周周乐
  exchange () {
    console.log('确认兑换')
    return
    Toast.loading('')
    get('http://credit.xianjincard.com/credit-invite/get-short-url').then(data => data.data).then(response => {
      Toast.hide()
      if (response.code !== 0) {
        if (response.code === -1001) {
          login()
          return
        }
        Popup.alert(Content.popupHtml(response.message), 'popup')
        Popup.click('a.click')
      }
    })
  }
  // 确认兑换?
  showAlert () {
    const alert = Modal.alert
    const alertInstance = alert('确定兑换周周乐吗', '', [
      { text: '暂时不换', onPress: () => console.log('cancel'), style: 'default' },
      { text: '确认兑换', onPress: () => { this.exchange() } }
    ])
  }

  render () {
    let imgUrl = '/assets/img/activity/week/gold-banner.png'
    return (
      <div className='transition-group'>
        <div className='gold-exchange'>
          <img src={imgUrl} />
          <button onClick={this.showAlert.bind(this)}>1000金币兑换</button>
          <div className='introduce'>
            <h2>中奖介绍</h2>
            <p>1、周周乐是回馈现金卡用户的免费抽奖活动，最高可获得1888元大奖，开奖时间为每周三12:00，可以在“现金卡—周周乐”观看直播开奖；</p>

            <p>2、周周乐中奖规则如下：<br />
            1) 一等奖：连续4张牌面一致，奖金1888元；<br />
            2) 二等奖：连续3张牌面一致，奖金88元；<br />
            3) 三等奖：连续2张牌面一致，奖金2元；<br />
            4) 四等奖：同顺序1张牌面一致，奖品为下期周周乐一注；</p>
          </div>
        </div>
      </div>
    )
  }
}
