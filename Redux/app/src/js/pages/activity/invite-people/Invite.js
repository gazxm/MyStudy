import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { share, partake, platform, resolveUrl, forwardApp, get, login, statistics } from 'utils'
import 'scss/activity/invite-people.component.scss'
import 'img/activity/invite-people/invite-06.png'

const peopleNum = 10

export default class Invite extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      overlay: false,
      code: 0,
      totalNum: [0],
      num: 0,
      inviteCode: '',
      result: []
    }
  }

  componentWillMount () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/default/invite-num?result_no=invitePeople').then(data => data.data).then(data => {
      Toast.hide()
      this.setState({
        code: data.code
      })
      if (data.code !== 0) {
        throw data
      }
      const num = peopleNum - parseInt(data.data.num)
      this.setState({
        inviteCode: data.data.invite_code,
        totalNum: this.formatNum(data.data.num),
        num: num > 0 ? num : 0,
        result: [{'name': '李**', 'phone': '156****1102'}, {'name': '黄**', 'phone': '186****6996'}, {'name': '张**', 'phone': '187****5768'}, {'name': '贺**', 'phone': '134****5689'}, {'name': '王**', 'phone': '182****8976'}, {'name': '冯**', 'phone': '137****9657'}, {'name': '金**', 'phone': '183****7474'}, {'name': '杨*', 'phone': '152****1418'}, {'name': '吕*', 'phone': '186****7589'}, {'name': '黄**', 'phone': '185****7729'}, {'name': '周**', 'phone': '158****6817'}, {'name': '张*', 'phone': '155****5798'}, {'name': '刘**', 'phone': '136****2139'}, {'name': '李*', 'phone': '187****0888'}, {'name': '岳**', 'phone': '152****7966'}, {'name': '刘*', 'phone': '136****1313'}, {'name': '王*', 'phone': '152****7026'}, {'name': '王**', 'phone': '134****6888'}, {'name': '秦**', 'phone': '159****0012'}, {'name': '陆**', 'phone': '183****8341'}]
      })
    }).catch(data => {
      Toast.hide()
      this.errorPopup(data.code)
    })
  }

  componentDidMount () {
    document.title = '邀请达人'
    share('invite-people')
  }

  showRule () {
    Popup.alert(Content.showRule(), 'popup-rule')
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

  invite () {
    if (!this.errorPopup(this.state.code)) {
      return
    }
    statistics({
      type: '邀请达人',
      tag: '立即邀请'
    })
    if (platform.isApp) {
      const url = resolveUrl(`http://h.xianjincard.com/activity/invite/share?invite_code=${this.state.inviteCode}`)
      const imgUrl = resolveUrl('http://h.xianjincard.com/assets/img/activity/invite-people/invite-06.png')
      partake({
        'share_title': '推荐你一个借款神器，5分钟借5000！',
        'share_body': '通过我的链接注册，借钱更快，首借还免本息哦~',
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

  formatNum (num) {
    let arr = []
    for (let i in num) {
      arr = [...arr, parseInt(num[i])]
    }
    return arr
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
    const { overlay, totalNum, num, result } = this.state

    const numDiv = totalNum.map((v, i) => <b key={i}>{v}</b>)

    return (
      <div className='transition-group'>
        <div className='invite-people'>
          <a className='rule' onClick={this.showRule.bind(this)} />
          <h3>借钱不用还</h3>
          <h4>邀请<b>10人</b>借款成功即得，可抵本金</h4>
          <a className='invite' onClick={this.invite.bind(this)}>立即邀请</a>
          <h5>邀请详情</h5>
          <p>您已邀请{numDiv}位好友成功借款</p>
          <h6>距离2000元现金还需邀请<b>{num}</b>位好友借款成功</h6>
          <h5 className='list-h5'>达人名单</h5>
          <div className='list'>
            <table className='table-one'>
              <tbody>
                <tr>
                  <td>用户名</td>
                  <td>手机号</td>
                </tr>
              </tbody>
            </table>
            <div className='list-two'>
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
          <div className={`overlay ${overlay ? 'yes' : ''}`} onClick={this.closeOverlay.bind(this)} />
          <h2>同享活动</h2>
          <div className='activity'>
            <i onClick={this.forward.bind(this)} />
          </div>
        </div>
      </div>
    )
  }
}
