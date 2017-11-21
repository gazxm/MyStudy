import React from 'react'
import Scroll from '../components/Scroll'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, goCertification, login, share, goHome } from 'utils'
import 'scss/activity/novice.component.scss'

export default class Xinshou extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      scrollData: {
        mainData: ['本息全免的名额'],
        length: 20,
        dataTime: 60,
        animTime: 3
      }
    }
  }

  componentDidMount () {
    document.title = '免费借钱'
    share('XinshouTwo')
  }

  showRule () {
    Popup.alert('<h3>活动规则</h3><div class="rule-content"><p>1、即日起，新注册首次申请并成功放款，即有机会获得【本息全免】的特权，每天11点、15点、20点各放出100名，按照放款顺序，先到先得；</p><p> 2、获得特权的用户，只要在还款日前成功还款（未逾期），即可享受【本息全免】，现金卡官方将全额返还首笔借款的本金+利息，真正做到“白借”；</p><p>3、获得特权的用户，如到期逾期还款，则视为自动放弃特权，不再退还本金+利息；</p><p>4、每位用户只有一次获奖机会，发现有用户通过不正当手段恶意刷奖，现金卡有权取消其获奖资格；</p><p>5、活动期间，新用户注册即可获得120元红包，红包内包含10元借款抵扣券一张（借款可用），10元续期抵扣券一张（续期可用），100元临时提额券一张（借款可用），以上所有红包券皆可在有效期内分开使用</p><p>6.、本活动最终解释权归现金卡所有，与Apple.Inc无关。</p></div>', 'popup-rule')
  }

  receive () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/default/guide').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(`<p>服务器繁忙 请稍后再试</p><a class='click'>朕知道了</a>`, 'popup')
        Popup.click('a.click')
        return
      }
      if (data.data.guide === 0) {
        Popup.alert(`<p>请先登录才能领取礼包哦</p><a class='click'>立即登录</a>`, 'popup')
        Popup.click('a.click', login)
        return
      }
      if (data.data.guide === 1) {
        Popup.alert(`<p>红包使用需要先认证哦</p><a class='click'>立即认证</a>`, 'popup')
        Popup.click('a.click', goCertification)
        return
      }
      goHome()
    })
  }

  render () {
    return (
      <div className='transition-group'>
        <div className='xinshouTwo'>
          <Scroll data={this.state.scrollData} />
          <h3 onClick={this.showRule.bind(this)}>活动规则详情</h3>
          <div className='foot'>
            <button onClick={this.receive.bind(this)}>立即借款</button>
          </div>
        </div>
      </div>
    )
  }
}
