import React from 'react'
import Scroll from './Scroll'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { platform, login, get, goHome, partake, forwardApp, share } from 'utils'
import 'scss/activity/group-loan.component.scss'
import 'img/activity/group-loan/group-loan-13.png'

const appMarket = 'GroupLoan'
export default class GroupLoan extends React.Component {
  constructor (props) {
    super(props)
    this.inviteCode = ''
    this.state = {
      groupName: '',
      groupCount: 0,
      groupType: 0,
      groupInviteCode: '',
      type: 0,
      unix: 0
    }
  }

  componentWillMount () {
    if (Math.floor(new Date().getTime() / 1000) < 1493776800) {
      this.setState({
        unix: 1
      })
    }
    this.inviteCode = this.props.location.query.invite_code
    if (!platform.isApp && this.inviteCode) {
      this.setState({
        type: 1
      })
      Toast.loading('')
      get(`http://credit.xianjincard.com/activity/group-loan-act/index?invite_code=${this.inviteCode}`).then(data => data.data).then(data => {
        Toast.hide()
        if (data.code !== 0) {
          Popup.alert(Content.showHtml(data.code), 'popup')
          Popup.click('a.click')
          return
        }
        if (data.data.is_leader && this.inviteCode === data.data.cur_group_invite_code) {
          this.setState({
            groupName: data.data.title,
            groupCount: data.data.count,
            groupType: 2
          })
          return
        }
        if (data.data.is_leader && this.inviteCode !== data.data.cur_group_invite_code) {
          this.setState({
            groupName: data.data.title,
            groupCount: data.data.count,
            groupType: 1,
            groupInviteCode: data.data.cur_group_invite_code
          })
          return
        }
        if (!data.data.is_leader && this.inviteCode === data.data.cur_group_invite_code) {
          this.setState({
            groupName: data.data.title,
            groupCount: data.data.count,
            groupType: 2
          })
          return
        }
        this.setState({
          groupName: data.data.title,
          groupCount: data.data.count,
          groupType: 0
        })
      })
    }
  }

  componentDidMount () {
    document.title = '组团借款'
    share('groupLoan')
  }

  open () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/group-loan-act/group?tag=h5-20170421-groupLoan_act').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup')
        if (data.code === -1001) {
          Popup.click('a.click', () => { login(appMarket) })
          return
        }
        if (data.code === -2003) {
          Popup.click('a.click', () => { goHome() })
          return
        }
        Popup.click('a.click')
        return
      }
      Popup.alert(Content.showHtml(data.code, data.data.count, data.data.is_leader), 'popup')
      Popup.click('a.click', () => {
        const url = `http://h.xianjincard.com/activity/group-loan?invite_code=${data.data.invite_code}`
        const imgUrl = 'http://h.xianjincard.com/assets/img/activity/group-loan/group-loan-13.png'
        partake({
          'share_title': '和我一起借，费用立减半',
          'share_body': '不分新老用户，通过这个链接借款，费用可减半，最快5分钟下款',
          'share_url': url,
          'share_logo': imgUrl
        })
      })
    })
  }

  join () {
    Toast.loading('')
    get(`http://credit.xianjincard.com/activity/group-loan-act/senate?invite_code=${this.inviteCode}&tag=h5-20170421-groupLoan_act`).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup')
        if (data.code === -1001) {
          Popup.click('a.click', () => { login(appMarket, this.inviteCode) })
          return
        }
        Popup.click('a.click')
        return
      }
      Popup.alert(Content.showHtml(2, data.data.count, data.data.is_leader, data.data.is_new), 'popup')
      this.setState({
        groupCount: data.data.count
      })
      if (data.data.is_leader === 1) {
        Popup.click('a.click', forwardApp)
        return
      }
      Popup.click('a.click')
    })
  }

  openTwo () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/group-loan-act/group?tag=h5-20170421-groupLoan_act').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup')
        if (data.code === -1001) {
          Popup.click('a.click', () => { login(appMarket, this.inviteCode) })
          return
        }
        if (data.code === -2003) {
          Popup.click('a.click', () => { goHome() })
          return
        }
        Popup.click('a.click')
        return
      }
      if (data.data.is_leader === 1) {
        window.location.reload()
        return
      }
      Popup.alert(Content.showHtml(1, data.data.count, data.data.is_leader), 'popup')
      Popup.click('a.click')
    })
  }

  forMy () {
    const { groupInviteCode } = this.state
    const url = `http://h.xianjincard.com/activity/group-loan?invite_code=${groupInviteCode}`
    window.location.href = url
  }

  inviteBtn () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/group-loan-act/group?tag=h5-20170421-groupLoan_act').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup')
        if (data.code === -1001) {
          Popup.click('a.click', () => { login(appMarket, this.inviteCode) })
          return
        }
        if (data.code === -2003) {
          Popup.click('a.click', () => { goHome() })
          return
        }
        Popup.click('a.click')
        return
      }
      Popup.alert(Content.showHtml(2, data.data.count, data.data.is_leader), 'popup')
      Popup.click('a.click')
    })
  }

  render () {
    const { groupName, groupCount, groupType, type, unix } = this.state

    const h1 = !type ? <h1>现金卡团借第一弹</h1> : <h1><b>{groupName}</b>团已有<b>{groupCount}</b>人</h1>
    const h2 = !type ? '' : <h2>三五成群，拉帮结派，组团享优惠</h2>
    const open = !type ? <a className='open' onClick={this.open.bind(this)}>我要开团</a> : null
    const look = !type ? <a className='look' onClick={this.open.bind(this)}>查看我的团</a> : null
    const open1 = type && groupType === 0 ? <a className='open' onClick={this.join.bind(this)}>我要参团</a> : null
    const look1 = type && groupType === 0 ? <a className='look' onClick={this.openTwo.bind(this)}>我要开团</a> : null
    const forMy = type && groupType === 1 ? <a className='center' onClick={this.forMy.bind(this)}>进入我的团</a> : null
    const inviteBtn = type && groupType === 2 ? <a className='center' onClick={this.inviteBtn.bind(this)}>立即邀请</a> : null
    const sr = unix ? <div className='div-scroll'>暂无排名</div> : <Scroll type={type} />

    return (
      <div className='transition-group'>
        <div className='group-loan'>
          <header className={`${!type ? '' : 'notInApp'}`}>
            <i className='rabbit1' />
            <i className='rabbit2' />
            <i className='rabbit3' />
            {h1}
            {sr}
            {h2}
          </header>
          <div className='content clearfix'>
            <div className='balloon clearfix'>
              <div className='balloon1'>
                <i />
                <p>用户申请借款后点击我要开团即可开团。当团队人数≥5人时，开团人即获7天免息券1张</p>
              </div>
              <div className='balloon2'>
                <i />
                <p>活动结束前，5人≤团队人数≤10人的参团用户，除开团人外均可获得5天免息券1张</p>
              </div>
            </div>
            {open}{look}{open1}{look1}{forMy}{inviteBtn}
          </div>
          <div className='rule'>
            <h3>活动规则</h3>
            <p><span>一</span>活动时间：2017年5月17日10:00——5月22日0:00</p>
            <p><span>二</span>活动对象：平台所有用户</p>
            <p><span>三</span>开团规则：申请借款后点击我要开团，即为开团成功</p>
            <p><span>四</span>参团规则：通过开团人链接注册/登录的用户，点击我要参团，即为参团成功</p>
            <p><span>五</span>活动期间，每人仅可参与1个团</p>
            <p><span>六</span>查看奖励：<b>活动结束前5人≤团队人数≤10人（含开团人），开团人获7天免息券1张，团队成员获5天免息券1张。</b>奖励发放至APP-【我的】-【优惠券】中，请注意查收，券使用有效期：从发放之日起15天内</p>
            <p><span>七</span>本活动最终解释权归现金卡所有，与Apple.Inc无关</p>
          </div>
        </div>
      </div>
    )
  }
}
