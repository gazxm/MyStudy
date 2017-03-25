import React from 'react'
import Popup from '../components/Popup'
import Content from './Content'
import Ticket from './Ticket'
import Input from './Input'
import 'scss/activity/share.component.scss'

export default class Share extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      contentFlag: false,
      inputFlag: false,
      invite_code: '',
      ticketHtml: '',
      phoneNumber: '',
      is_new: 0,
      infoData: {
        amount: 0,
        expire_date: '',
        tel: ''
      }
    }
  }

  componentDidMount () {
    document.title = '分享红包'
  }

  setInfoData (data2, phone) {
    if (data2.code === -1004 || data2.code === -1002) {
      this.setState({
        contentFlag: true,
        inputFlag: false
      })
      return
    }
    if (data2.code === -2010) {
      this.setState({
        infoData: {
          amount: data2.data.amount,
          expire_date: data2.data.expire_date,
          tel: phone
        },
        contentFlag: false,
        ticketFlag: true
      })
      Popup.alert(Content.popupHtml(`你已经领取过该红包了哦~`), 'popup')
      Popup.click('a.click')
      return
    }
    if (data2.code === 0) {
      this.setState({
        infoData: {
          amount: data2.data.amount,
          expire_date: data2.data.expire_date,
          tel: phone
        },
        contentFlag: false,
        ticketFlag: true
      })
      return
    }
    const ticketHtml = Content.ticketNodata(data2.code)
    console.log(ticketHtml)
    this.setState({
      contentFlag: false,
      ticketFlag: false,
      ticketHtml: ticketHtml
    })
    return
  }

  render () {
    const { contentFlag } = this.state

    const content = contentFlag ? <Input share={this} /> : <Ticket share={this} />

    return (
      <div className='transition-group'>
        <div className='share'>
          <div className='content'>
            {content}
          </div>
          <div className='rule'>
            <h3>活动细则</h3>
            <p>1、红包新老用户同享</p>
            <p>2、红包与平台其他活动优惠可同享</p>
            <p>3、每人每天只有三次抢红包机会</p>
            <p>4、领取红包的手机号必须与使用账户优惠券的手机号一致</p>
            <p>5、发放至手机号的红包需在app用手机号注册，登录后方能使用</p>
            <p>6、现金卡保留法律允许范围内的对活动的解释权</p>
          </div>
        </div>
      </div>
    )
  }
}
