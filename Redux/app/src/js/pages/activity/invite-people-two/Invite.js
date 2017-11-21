import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, share, resolveUrl, platform, forwardApp, login, copy, partake, statistics } from 'utils'
import 'scss/activity/invite-people-two.component.scss'

const peopleNum = 10

export default class Invite extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      overlay: false,
      code: 0,
      inviteCode: '',
      totalNum: 0,
      num: 10,
      result: [],
      shareTextArr: [],
      shareText: '',
      inviteUrl: ''
    }
    this.textFlag = 0
  }

  componentWillMount () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/invite-people-act/invite-num?result_no=invitePeople').then(data => data.data).then(data => {
      Toast.hide()
      this.setState({
        code: data.code
      })
      if (data.code !== 0) {
        if (data.code === -2013) {
          Popup.alert(Content.showHtml(data.code), 'popup')
          Popup.click('a.click')
        } else {
          throw data
        }
      }
      const num = peopleNum - parseInt(data.data.num)
      this.setState({
        inviteCode: data.data.invite_code,
        totalNum: data.data.num,
        num: num > 0 ? num : 0,
        result: data.data.result,
        shareTextArr: data.data.share_text,
        shareText: data.data.share_text[this.textFlag]
      })
      const url = resolveUrl(`http://h.xianjincard.com/activity/invite/share?invite_code=${data.data.invite_code}`)
      Toast.loading('')
      get('http://credit.xianjincard.com/credit-invite/get-short-url?url=' + encodeURIComponent(url)).then(data => data.data).then(data2 => {
        Toast.hide()
        if (data2.code === 1) {
          this.setState({
            inviteUrl: data2.data.short_url
          })
        }
      })
    }).catch(data => {
      Toast.hide()
      if (data) {
        this.errorPopup(data.code)
        return
      }
      Popup.alert(Content.showHtml(-3000), 'popup')
      Popup.click('a.click')
    })
  }

  componentDidMount () {
    document.title = '邀请达人'
    share('invite-people-two')
  }

  showRule () {
    Popup.alert(Content.showRule(), 'popup-rule')
    Popup.click('b.wechat', () => {
      location.href = resolveUrl('http://h.xianjincard.com/mobile/wechat')
    })
  }

  invite () {
    if (!this.errorPopup(this.state.code)) {
      return
    }
    statistics({
      type: '邀请达人第二期',
      tag: '立即邀请'
    })
    if (platform.isApp) {
      const url = resolveUrl(`http://h.xianjincard.com/activity/invite/share?invite_code=${this.state.inviteCode}`)
      const imgUrl = 'https://res.xianjincard.com/xjk_yy/1595353ada1a8e.png'
      partake({
        'share_title': '5分钟借款5千元，首借免本息',
        'share_body': '通过这个链接注册，速度更快哦！还有机会白拿1999元现金！',
        'share_url': url,
        'share_logo': imgUrl
      })
      return
    }
    if (platform.isWeixin) {
      this.setState({
        overlay: true
      })
      return
    }
    Popup.alert(Content.popupHtml('请下载APP再去分享哦~', '立即下载'), 'popup')
    Popup.click('a.click', forwardApp)
  }

  change () {
    const { shareTextArr } = this.state
    this.setState({
      shareText: shareTextArr[this.textFlag]
    })
    if (this.textFlag === shareTextArr.length - 1) {
      this.textFlag = 0
      return
    }
    this.textFlag++
  }

  copy () {
    if (!this.errorPopup(this.state.code)) {
      return
    }
    statistics({
      type: '邀请达人第二期',
      tag: '一键复制'
    })
    const { shareText, inviteUrl } = this.state
    copy(`${shareText} > ${inviteUrl}`)
  }

  errorPopup (code) {
    if (code !== 0) {
      Popup.alert(Content.showHtml(code), 'popup')
      if (code === -1001) {
        Popup.click('a.click', login)
        return false
      }
      Popup.click('a.click')
      return false
    }
    return true
  }

  closeOverlay () {
    this.setState({
      overlay: false
    })
  }

  forward () {
    location.href = resolveUrl('http://h.xianjincard.com/activity/invite')
  }

  render () {
    const { overlay, num, totalNum, shareText, inviteUrl, result } = this.state

    return (
      <div className='transition-group'>
        <div className='invite-people'>
          <a className='rule' onClick={this.showRule.bind(this)}>活动规则</a>
          <h3>活动时间:8月11日—9月10日</h3>
          <h2>人脉特别厉害的可以从这里直接邀请哦~</h2>
          <a className='a-invite' onClick={this.invite.bind(this)}>立即邀请</a>
          <p>你也可以复制下面的文字和链接到老司机亲测有效渠道<br /><b> > 借贷论坛、贴吧</b></p>
          <div className='share-text'>
            <h4>{shareText}<b> > {inviteUrl !== '' ? inviteUrl : '（登录显示您的专属链接）'}</b></h4>
            <a className='change' onClick={this.change.bind(this)}>换一个试试</a>
            <a className='copy' onClick={this.copy.bind(this)}>一键复制文字和链接</a>
          </div>
          <h1 className='my-situ' />
          <h5>你已邀请<b>{totalNum}位</b>好友成功借款，<br />距离1999元现金还需邀请<b>{num}位</b>好友借款成功</h5>
          <div className='list'>
            <table className='table-one'>
              <tbody>
                <tr>
                  <td className='head' colSpan='2'>达标名单</td>
                </tr>
                <tr>
                  <td>姓名</td>
                  <td>电话</td>
                </tr>
              </tbody>
            </table>
            <div className='div-table'>
              <table className='table-two'>
                <tbody>
                  {result.length > 0 ? result.map((v, i) =>
                    <tr key={i}>
                      <td>{v.name}</td>
                      <td>{v.phone}</td>
                    </tr>
                  ) : <tr className='single'>
                    <td>暂无数据</td>
                  </tr>}
                </tbody>
              </table>
            </div>
          </div>
          <h1 className='activity-head' />
          <div className='activity'>
            <i onClick={this.forward.bind(this)} />
          </div>
          <div className={`overlay ${overlay ? 'yes' : ''}`} onClick={this.closeOverlay.bind(this)} />
        </div>
      </div>
    )
  }
}
