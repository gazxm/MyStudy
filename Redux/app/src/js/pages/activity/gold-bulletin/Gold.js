import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, share, login, goHome, goCertification, statistics } from 'utils'
import 'scss/activity/gold-bulletin.component.scss'

export default class Gold extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {}
    }
  }

  componentDidMount () {
    document.title = '金卡公告'
    share('gold-bulletin')
    statistics({
      type: '金卡公告',
      tag: '页面访问'
    })
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/default/act-info?key=campaign&tag=h5-20170615-campaign').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup')
        Popup.click('a.click')
        return
      }
      this.setState({
        data: data.data
      })
    })
  }

  loan () {
    const { data } = this.state
    if (!data.login) {
      Popup.alert(Content.showHtml(-1001), 'popup')
      Popup.click('a.click', login)
      return
    }
    if (data.date !== 1) {
      Popup.alert(Content.showHtml(data.date), 'popup')
      Popup.click('a.click')
      return
    }
    statistics({
      type: '金卡公告',
      tag: '申请借款'
    })
    if (data.card_type === 0) {
      Popup.alert(Content.showHtml(-2100), 'popup')
      Popup.click('a.click', goCertification)
      return
    }
    goHome()
  }

  gold () {
    const { data } = this.state
    if (!data.login) {
      Popup.alert(Content.showHtml(-1001), 'popup')
      Popup.click('a.click', login)
      return
    }
    if (data.date !== 1) {
      Popup.alert(Content.showHtml(data.date), 'popup')
      Popup.click('a.click')
      return
    }
    statistics({
      type: '金卡公告',
      tag: '认证金卡'
    })
    if (data.card_type === 0) {
      goCertification()
      return
    }
    Popup.alert(Content.showHtml(data.card_type), 'popup')
    Popup.click('a.click', goHome)
  }

  render () {
    return (
      <div className='transition-group'>
        <div className='gold'>
          <div className='button'>
            <a className='a-loan' onClick={this.loan.bind(this)}><span>申请借款</span></a>
            <a className='a-gold' onClick={this.gold.bind(this)}><span>认证金卡</span></a>
          </div>
        </div>
      </div>
    )
  }
}
