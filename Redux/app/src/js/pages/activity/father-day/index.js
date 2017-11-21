import React from 'react'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, share, login, goHome } from 'utils'
import 'scss/activity/father-day.component.scss'
export default class Father extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    document.title = '父亲节'
    share('father')
  }

  fetch () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/default/act-info?key=oc_activity_key').then(data => data.data).then(data => {
      Toast.hide()

      if (data.data.login !== 1) {
        Popup.alert(`<p>您还没有登录哦</p><a class='click'>立即登录<i class='hd' /></a>`, 'popup')
        Popup.click('a.click', login)
        return
      }
      if (data.data.date !== 1) {
        if (data.data.date === -2012) {
          Popup.alert(`<p>活动还没有开始哦</p><a class='click'>知道啦<i class='hd' /></a>`, 'popup')
          Popup.click('a.click')
          return
        }
        if (data.data.date === -2013) {
          Popup.alert(`<p>活动已经结束啦</p><a class='click'>知道啦<i class='hd' /></a>`, 'popup')
          Popup.click('a.click')
          return
        }
        if (data.data.date === 0) {
          Popup.alert(`<p>服务器繁忙，请稍后再试</p><a class='click'>知道啦<i class='hd' /></a>`, 'popup')
          Popup.click('a.click')
          return
        }
      }
      goHome()
    })
  }
  render () {
    return (
      <div className='transition-group'>
        <div className='father'>
          <div className='banner1' />
          <div className='banner2' />
          <div className='banner3' />
          <div className='banner4' />
          <button className='btn' onClick={this.fetch.bind(this)} >孝敬爸爸</button>
        </div>
      </div>
    )
  }
}
