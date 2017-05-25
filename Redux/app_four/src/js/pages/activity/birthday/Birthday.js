import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, login, back, goHome } from 'utils'
import 'scss/activity/birthday.component.scss'

export default class Birthday extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      type: false,
      name: ''
    }
  }

  componentDidMount () {
    document.title = '生日有礼'
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/birthday-act/index').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup')
        if (data.code === -1001) {
          Popup.click('a.click', () => { login() })
          return
        }
        if (data.code === -2025) {
          this.setState({
            type: true,
            name: data.data.name
          })
          Popup.click('a.click')
          return
        }
        Popup.closeClick('div.popup-cover', back)
        Popup.closeClick('span.close', back)
        Popup.click('a.click', back)
        return
      }
      this.setState({
        type: true,
        name: data.data.name
      })
    })
  }

  use () {
    goHome()
  }

  render () {
    const { type, name } = this.state
    const reward = type ? <div><div className='overlay'><div className='bgAnim' /></div><div className='reward'><p className='head'>亲爱的{name}，白卡君独宠你一人哒~</p><a className='use' onClick={this.use.bind(this)} /></div></div> : null
    return (
      <div className='transition-group'>
        <div className='birthday'>
          {reward}
        </div>
      </div>
    )
  }
}
