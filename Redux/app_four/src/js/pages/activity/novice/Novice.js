import React from 'react'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, goCertification, login } from 'utils'
import 'scss/activity/novice.component.scss'

export default class Novice extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/novice-act/get-coupon').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(`<p>${data.message ? data.message : '服务器繁忙，请稍后再试'}</p>${data.code === -1001 ? `<a class='click'>立即登录</a>` : `<a class='click'>朕知道了</a>`}`, 'popup')
        if (data.code === -1001) {
          Popup.click('a.click', login)
          return
        }
        Popup.click('a.click')
        return
      }
      goCertification()
    })
  }

  componentDidMount () {
    document.title = '新手活动'
  }

  render () {
    return (
      <div className='transition-group'>
        <div className='novice'>
          <p>领券中，请稍候...</p>
        </div>
      </div>
    )
  }
}
