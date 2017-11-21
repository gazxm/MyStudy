import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, resolveUrl, login, share } from 'utils'
import 'scss/activity/tanabata.component.scss'

export default class ViewAll extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sharePopup: true
    }
  }

  componentDidMount () {
    document.title = '我的心里“指”有你'
    this.fetchData()
    const { query } = this.props.location
    share('tanabata', {sign: query.sign})
  }

  // 微信授权
  wxShouquan (code) {
    if (code === -1001) {
      location.href = resolveUrl('http://credit.xianjincard.com/wx/user-auth-template?redirectUrl=' + encodeURIComponent(location.href))
      return false
    }
    return true
  }

  fetchData () {
    Toast.loading('')
    get(`http://credit.xianjincard.com/activity/valentine-day-act/my-friend`).then(data => data.data).then(response => {
      Toast.hide()
      if (!this.wxShouquan(response.code)) {
        return
      }
      if (response.code !== 0) {
        if (response.code === -1001) {
          login()
          return
        }
        Popup.alert(Content.popupHtml(response.message), 'popup')
        Popup.click('a.click')
      }
      this.setState({
        data: response.data && response.data.length > 0 ? response.data : []
      })
    })
  }

  showShareGuid () {
    this.setState({
      sharePopup: false
    })
  }

  hideShareGuid () {
    this.setState({
      sharePopup: true
    })
  }

  render () {
    const { data, sharePopup } = this.state

    return (
      <div className='transition-group'>
        <div className='tanabata view-all'>
          <span className='tit' />
          {data && data.length > 0 ? <div className='list'>
            <table>
              <thead><tr><th>好友头像</th><th>好友昵称</th><th>亲密指数</th></tr></thead>
              <tbody>
                {data && data.length > 0 ? data.map((v, i) => <tr key={i}><td><img src={v.img} /></td><td>{v.nickname}</td><td>{v.close_index}</td></tr>) : <tr><td colSpan='3' className='nodata'>暂无数据</td></tr>}
              </tbody>
            </table>
          </div> : <div><p>你还没有主动与好友测过指数<br />快主动发给你的好友吧</p><a onClick={this.showShareGuid.bind(this)}>发给好友</a></div> }
        </div>
        <div className={`popup-guid ${sharePopup ? 'hide' : ''}`} onClick={this.hideShareGuid.bind(this)}>
          <div className='overlay' />
          <div className='content' />
        </div>
      </div>
    )
  }
}
