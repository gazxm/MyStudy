import React from 'react'
import { get, post, resolveUrl, forwardApp } from 'utils'
import Toast from '../../../components/Toast'
import Popup from '../components/Popup'
import Content from './Content'

export default class Ticket extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ticketFlag: false
    }
  }

  componentDidMount () {
    const { share } = this.props
    if (share.state.phoneNumber) {
      this.getRed(share.state.phoneNumber, share.state.is_new)
      return
    }
    Toast.loading('')
    get('http://credit.xianjincard.com/act/red-pack-act').then(data => data.data).then(data => {
      if (data.code === -1001) {
        Toast.hide()
        // location.href = resolveUrl('http://credit.xianjincard.com/wx/user-auth-template?redirectUrl=' + 'http://localhost:8000/activity/share')
        return
      }
      if (data.code === 0) {
        Toast.hide()
        if (data.data) {
          this.getRed(data.data, 0)
          return
        }
        share.setState({
          contentFlag: true
        })
      } else {
        Toast.hide()
        const message = data.message ? data.message : '服务器繁忙，请稍候重试'
        Popup.alert(Content.popupHtml(`${message}`), 'popup')
        Popup.click('a.click')
      }
    })
  }

  getRed (phone, isNew) {
    const { share } = this.props
    const params = {
      phone: phone,
      sign: share.props.location.query.sign,
      is_new: isNew
    }
    Toast.loading('')
    post('http://credit.xianjincard.com/act/get-red-pack', params).then(data => data.data).then(data2 => {
      Toast.hide()
      share.setInfoData(data2, phone)
      share.setState({
        invite_code: (typeof data2.data.invite_code !== 'undefined') ? data2.data.invite_code : ''
      })
    })
  }

  changePhone () {
    this.props.share.setState({
      contentFlag: true,
      inputFlag: false
    })
  }

  invite () {
    const inviteUrl = `http://localhost:8000/activity/invite?invite_code=${this.state.invite_code}`
    location.href = inviteUrl
  }

  render () {
    const { ticketFlag, infoData, ticketHtml } = this.props.share.state

    const ticketContent = ticketFlag ? <div className='ticket clearfix'>
      <div className='left'>
        <p><b>{infoData.amount}</b>元</p>
        <p>分享红包抵扣券</p>
      </div>
      <div className='right'>
        <p>限借款金额：满<b>1000</b>元</p>
        <p>限借款期限: <b>14</b>天以上</p>
        <p>有效期至: {infoData.expire_date}</p>
      </div>
      <p className='account'>红包已发放至账户
      <a onClick={() => this.changePhone()}>{infoData.tel} 修改></a></p>
    </div> : <div className='ticket no-data' dangerouslySetInnerHTML={{__html: ticketHtml}} />

    return (
      <div className='ticket-content'>
        {ticketContent}
        <a className='use' onClick={forwardApp}>立即使用</a>
        <a className='invite' onClick={this.invite.bind(this)}>邀请好友送红包，奖励停不下来</a>
      </div>
    )
  }
}
