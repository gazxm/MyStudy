import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, login, goHome, share } from 'utils'
import 'scss/activity/personal-tailor.component.scss'

export default class index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentWillMount () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/scene-tags-act/index').then(data => data.data).then(data => {
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

  componentDidMount () {
    document.title = '私人订制'
    share('personal')
  }

  showRule () {
    Popup.alert(Content.showRule(), 'popup-rule')
  }

  showPopup (data) {
    Popup.alert(Content.popup(data), 'popup-show')
    Popup.click('a.click', () => {
      this.forWord(data.id)
    })
  }

  forWord (id) {
    Toast.loading('')
    get(`http://credit.xianjincard.com/activity/scene-tags-act/click?id=${id}`).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup')
        if (data.code === -1001) {
          Popup.click('a.click', login)
          return
        }
        Popup.click('a.click')
        return
      }
      goHome()
    })
  }

  render () {
    const { data } = this.state
    const forwordHtml = data.length > 0 ? data.map((v, i) => <li key={i} onClick={() => this.showPopup(v)}><h3>{v.name}</h3><img src={v.icon} /></li>) : null

    return (
      <div className='transition-group'>
        <div className='personal-tailor'>
          <a className='rule' onClick={this.showRule.bind(this)}>活动<br />规则</a>
          <ul>
            {forwordHtml}
          </ul>
        </div>
      </div>
    )
  }
}
