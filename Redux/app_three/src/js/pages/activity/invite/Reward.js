import React from 'react'
import { Tabs, WhiteSpace } from 'antd-mobile'
import { get, login, forwardApp, platform } from 'utils'
import Toast from '../../../components/Toast'

import 'scss/activity/invite.component.scss'

const TabPane = Tabs.TabPane

export default class Reward extends React.Component {
  constructor (props) {
    super(props)
    this.pageOne = 0
    this.pageTwo = 0
    this.loadTwo = 1
    this.state = {
      cashState: false,
      popupState: {
        isShow: false,
        tip: '',
        content: '',
        callback: ''
      },
      firstInvitation: [],
      secondInvitation: [],
      moreOneFlag: false,
      moreTwoFlag: false,
      index: {}
    }
  }

  componentDidMount () {
    document.title = '我的奖金'
    Toast.loading('')
    get('http://credit.xianjincard.com/credit-invite/index').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code === -1001) {
        login()
        return
      }
      if (data.code !== 0) {
        this.popupInfo('服务器繁忙 请稍候再试', '朕知道了')
        return
      }
      this.setState({index: data.data})
      this.loadMoreOne()
    })
  }

  changeTabs (key) {
    if (key === '2' && this.loadTwo) {
      this.loadTwo = 0
      this.loadMoreTwo()
    }
  }

  showRule (e) {
    this.setState({cashState: true})
  }

  closeRule (e) {
    this.setState({cashState: false})
  }

  loadMoreOne () {
    this.pageOne++
    Toast.loading('')
    get('http://credit.xianjincard.com/credit-invite/list-one?page=' + this.pageOne).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code === -1001) {
        login()
        return
      }
      if (data.code !== 0) {
        this.popupInfo('服务器繁忙 请稍候再试', '朕知道了')
        return
      }
      if (data.data.list.length === 15) {
        this.setState({moreOneFlag: true})
      }
      this.setState({firstInvitation: [...this.state.firstInvitation, ...data.data.list]})
      if (data.data.list.length < 15 && this.state.firstInvitation.length !== 0) {
        Toast.info('已全部加载', 2)
        this.setState({moreOneFlag: false})
      }
    })
  }

  loadMoreTwo () {
    this.pageTwo++
    Toast.loading('')
    get('http://credit.xianjincard.com/credit-invite/list-two?page=' + this.pageTwo).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code === -1001) {
        login()
        return
      }
      if (data.code !== 0) {
        this.popupInfo('服务器繁忙 请稍候再试', '朕知道了')
        return
      }
      if (data.data.list.length === 15) {
        this.setState({moreTwoFlag: true})
      }
      this.setState({secondInvitation: [...this.state.secondInvitation, ...data.data.list]})
      if (data.data.list.length < 15 && this.state.secondInvitation.length !== 0) {
        Toast.info('已全部加载', 2)
        this.setState({moreTwoFlag: false})
      }
    })
  }

  goBind () {
    if (!platform.isApp) {
      this.popupInfo('请下载最新的APP，<br />完成绑卡之后再提现哦！', '立即下载', forwardApp)
      return
    }
    if (typeof (nativeMethod) !== 'undefined') {
      nativeMethod.returnNativeMethod(`{"type":"3"}`)
    }
  }

  drawal () {
    if (this.state.index.account / 100 < 30) {
      return
    }
    if (!platform.isApp) {
      this.popupInfo('请下载最新的APP，<br />到“我的”-“现金红包”提现', '立即下载', forwardApp)
      return
    }
    const versionArr = platform.version.split('.')
    const version = parseInt(versionArr[0] + versionArr[1] + versionArr[2], 10)
    if (version < 147) {
      this.popupInfo('您的版本过旧，<br />请下载最新APP，<br />到“我的”-“现金红包”提现', '朕知道了')
      return
    }
    this.popupInfo('请到“我的”-“现金红包”提现', '朕知道了')
  }

  popupInfo (content, tip, callback) {
    this.setState({
      popupState: {
        isShow: true,
        content,
        tip,
        callback
      }
    })
  }

  closePopup (e) {
    this.setState({popupState: {isShow: false}})
  }

  okPopup (e) {
    this.state.popupState.callback && this.state.popupState.callback()
    this.closePopup()
  }

  render () {
    const { cashState, popupState, firstInvitation, secondInvitation, moreOneFlag, moreTwoFlag, index } = this.state

    const topList = index.top_ad ? index.top_ad.map((v, i) =>
      <span key={i}>{v.encode_name} 成功申请<i>{v.count}</i>人，领取奖励<i>{v.total_money / 100}</i>元；</span>
    ) : null

    const top = index.is_bind_card ? <p>{topList}</p> : <div className='no-bind clearfix'><span>若要领取奖金，请先绑定银行卡</span><a onClick={this.goBind.bind(this)}>去绑卡></a></div>

    const listOne = firstInvitation.length > 0 ? firstInvitation.map((v, i) =>
      <div className='list' key={i}>
        <p>{v.name}<br /><small>{v.record_time}</small></p>
        <p>成功申请<br /><small>{v.amount / 100}</small></p>
        <p>{v.rebate / 100}</p>
      </div>
    ) : <div className='no-list'>暂无返利记录</div>

    const listTwo = secondInvitation.length > 0 ? secondInvitation.map((v, i) =>
      <div className='list' key={i}>
        <p>{v.name}<br /><small>{v.record_time}</small></p>
        <p>成功申请<br /><small>{v.amount / 100}</small></p>
        <p>{v.rebate / 100}</p>
      </div>
    ) : <div className='no-list'>暂无返利记录</div>

    const cash = cashState ? <div className='rule cash'>
      <div className='overlay' onClick={this.closeRule.bind(this)} />
      <div className='dialog'>
        <span className='close' onClick={this.closeRule.bind(this)} />
        <h3>提现说明</h3>
        <div className='rule-content'>
          <p>1、每个周可申请一次现金提现；</p>
          <p>2、累计满30元才可以提现，且只能全额提取；</p>
          <p>3、处于逾期状态中的用户需先还款才可以提现</p>
          <p>4、申请成功后，奖金将在3个工作日内发放到您绑定的银行卡上;</p>
          <p>5、如遇法定节假日，提现进度顺延；</p>
          <p>6、如有问题请拨打客服热线021-80260893</p>
        </div>
      </div>
    </div> : null

    const moreOne = moreOneFlag ? <p className='more' onClick={this.loadMoreOne.bind(this)}>点击加载更多</p> : null

    const moreTwo = moreTwoFlag ? <p className='more' onClick={this.loadMoreTwo.bind(this)}>点击加载更多</p> : null

    const popup = popupState.isShow ? <div class='popup popup-confirm'>
      <div class='overlay' onClick={(this.closePopup.bind(this))} />
      <div class='dialog confirm-dialog'>
        <span class='close' onClick={this.closePopup.bind(this)} />
        <p dangerouslySetInnerHTML={{__html: popupState.content}} />
        <a onClick={this.okPopup.bind(this)}>{popupState.tip}</a>
      </div>
    </div> : null

    return (
      <div className='transition-group'>
        <div className='reward'>
          <div className='top'>
            {top}
          </div>
          <div className='head'>
            <p>当前可提现奖金</p>
            <h1>{index.account ? (index.account / 100).toFixed(2) : (0).toFixed(2)}<span>元</span></h1>
            <p>历史获得奖金：{index.invite_account ? index.invite_account / 100 : 0}元</p>
            <a className={index.account / 100 >= 30 ? '' : 'disabled'} onClick={this.drawal.bind(this)}>立即提现</a>
          </div>
          <Tabs defaultActiveKey='1' swipeable={false} onChange={this.changeTabs.bind(this)}>
            <TabPane tab='一级邀请奖励' key='1'>
              <div className='reward-content'>
                {listOne}
                {moreOne}
              </div>
            </TabPane>
            <TabPane tab='二级邀请奖励' key='2'>
              <div className='reward-content'>
                {listTwo}
                {moreTwo}
              </div>
            </TabPane>
          </Tabs>
          <WhiteSpace />
          {cash}
          {popup}
          <a className='a-cash' onClick={this.showRule.bind(this)}>提现说明</a>
        </div>
      </div>
    )
  }
}
