import React from 'react'
import {platform, login, share, get} from 'utils'
import Toast from '../../../components/Toast'
import 'scss/activity/women.component.scss'

export default class WomenShare extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ruleState: false,
      ruleClass: false,
      popupState: {
        isShow: false,
        tip: '',
        content: '',
        callback: ''
      }
    }
  }

  componentDidMount () {
    document.title = '女王驾到'
    share('women')
  }

  apply (e) {
    if (platform.isAndroid && !platform.isWeixin) {
      window.location.href = 'https://credit.xianjincard.com/download-app.html'
    } else if (platform.isIos && !platform.isWeixin) {
      window.location.href = 'https://itunes.apple.com/app/id1156410247?mt=8'
    } else {
      window.location.href = 'https://api.xianjincard.com/download-app.html'
    }
  }

  getTicket (e) {
    Toast.loading('')
    get('http://credit.xianjincard.com/credit-info/get-women-day-prize').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code === -10) {
        this.popupInfo('亲，请不要过快点击哦！', '朕知道了')
        return
      }
      if (data.code === -3) {
        this.popupInfo('请先登录', '点此登录', login)
        return
      }
      if (data.code === -5) {
        this.popupInfo('您还未认证，无法抽奖<br />请至APP进行实名认证', '立即下载', this.apply)
        return
      }
      if (data.code === -2) {
        this.popupInfo('活动还未开始哦！', '朕知道了')
        return
      }
      if (data.code === -1) {
        this.popupInfo('活动已经结束了，<br />请关注平台其他活动哦！', '朕知道了')
        return
      }
      if (data.code === -4) {
        this.popupInfo('仅限女性领取哦！<br />快去申请借款吧，<br />万一不用还了呢', '朕知道了')
        return
      }
      if (data.code === -6) {
        this.popupInfo(`${data.message}`, '朕知道了')
        return
      }
      if (data.code === 0) {
        this.popupInfo(`${data.message}`, '朕知道了')
        return
      }
      this.popupInfo('服务器繁忙，请稍候重试', '朕知道了')
    })
  }

  showRule (e) {
    this.setState({ruleState: true})
    setTimeout(() => {
      this.setState({ruleClass: true})
    }, 100)
  }

  closeRule (e) {
    this.setState({ruleClass: false})
    setTimeout(() => {
      this.setState({ruleState: false})
    }, 300)
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
    const { ruleState, ruleClass, popupState } = this.state

    const rule = ruleState ? <div class='rule'>
      <div class='overlay' onClick={this.closeRule.bind(this)} />
      <div class='animation-dialog'>
        <div className={ruleClass ? 'dialog active' : 'dialog'}>
          <h3>活动规则</h3>
          <div class='rule-content'>
            <h4>一、活动时间</h4>
            <p>2017年3月6日10:00~3月8日15:00</p>
            <h4>二、参与对象</h4>
            <p>所有注册用户在活动期间均可参与活动</p>
            <h4>三、【女王驾到 不得无礼】活动规则</h4>
            <p>活动期间，所有女性用户（以身份证信息为准）均可免费随机抽取一张优惠券。</p>
            <h4>四、【大赦天下 借款不用还】活动规则</h4>
            <p>1、活动期间进行申请，且首次放款的新用户，手机号末四位和当天【上证指数收盘价+深圳成指收盘价之和】的末四位（含小数点后两位）数字及顺序都相同，即可获得“借钱不用还”大奖；</p>
            <p>2、活动期间进行申请，且放款（非首次）的老用户，手机号末五位和当天【上证指数收盘价+深圳成指收盘价之和】的末五位（含小数点后两位）数字及顺序都相同，即可获得“借钱不用还”大奖；</p>
            <p>（备注：返现总额50万元，发完为止）</p>
            <p>3、现金卡官方将于次日上午12:00前公布前一日获奖名单，节假日顺延；</p>
            <p>4、现金卡官方将全额返还借款本金+利息，真正做到“借钱不用还”；</p>
            <p>（备注：3月6日10:00~15:00内申请的用户以3月6日收盘价为准，计入3月6日获奖系统；3月6日15:00~3月7日15:00内申请的用户，以3月7日收盘价为准，计入3月7日获奖系统；3月7日15:00~3月8日15:00内申请的用户，以3月7日收盘价为准，计入3月8日获奖系统）</p>
            <h4>五、返现流程</h4>
            <p>1、现金卡官方将于中奖当日18:00前公布在活动页面，并发送获奖短信至获奖用户，平台客服将于2个工作日内联系中奖用户，验证获奖信息，请大家保持手机畅通；</p>
            <p>2、验证成功后，用户须在订单还款期内全额还款，确认还款后现金卡官方将在3个工作日内将该笔借款本金+利息全额打至获奖用户绑定的银行卡中；</p>
            <p>3、中奖订单如有逾期现象时，取消获奖资格，不予返现。</p>
            <h4>六、活动声明</h4>
            <p>1、活动期间，每位用户只有一次获奖机会，只有最终放款的用户才有资格获奖；</p>
            <p>2、若发现有用户通过不正当手段恶意刷奖，现金卡有权取消其获奖资格；</p>
            <p>3、本活动最终解释权归现金卡所有，与Apple.Inc无关。</p>
          </div>
          <div class='pack' onClick={this.closeRule.bind(this)}>收起</div>
        </div>
      </div>
    </div> : null

    const popup = popupState.isShow ? <div class='popup'>
      <div class='overlay' onClick={this.closePopup.bind(this)} />
      <div class='dialog'>
        <span class='close' onClick={this.closePopup.bind(this)} />
        <p dangerouslySetInnerHTML={{__html: popupState.content}} />
        <a onClick={this.okPopup.bind(this)}>{popupState.tip}</a>
      </div>
    </div> : null
    return (
      <div>
        <div class='transition-group'>
          <div class='womenshare'>
            <h3>恭喜获得<b>【借钱不用还】</b>参与资格</h3>
            <h2>女王驾到 不得无礼</h2>
            <p>活动期间,<b>所有女性用户</b>可随机领取一张优惠券<br />（以身份证信息为准）</p>
            <a onClick={this.getTicket.bind(this)}>点此免费领券</a>
            <h2 class='h2-two'>大赦天下 借钱不用还</h2>
            <i />
            <p>前往APP借款<br />获取<b>“借钱不用还”</b>特权</p>
          </div>
        </div>
        <a class='rule-button' onClick={this.showRule.bind(this)}>活动规则</a>
        <div class='fixed'>
          <div class='button' onClick={this.apply.bind(this)}>立即申请</div>
        </div>
        {rule}
        {popup}
      </div>
    )
  }
}
