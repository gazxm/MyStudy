import React from 'react'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { resolveUrl, get, login, statistics } from 'utils'
import 'scss/activity/overlord-order.component.scss'

export default class Overlord extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      classA: '',
      classB: '',
      classC: '',
      overlay: {
        display: 'none'
      }
    }
    this.type = 0
    this.flag = 0
    this.time = 0
  }

  componentDidMount () {
    document.title = '霸王令'
  }

  privilege () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/vip-act/index').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        statistics({
          type: 'vip',
          tag: '马上拿特权弹窗'
        })
        if (data.data.id) {
          location.href = resolveUrl(`http://h.xianjincard.com/activity/overlord/result?id=${data.data.id}`)
          return
        }
        if (data.code === -1001) {
          Popup.alert(`<p>${data.message}</p><a class='click'>马上登录</a>`, 'popup')
          Popup.click('a.click', login)
          return
        }
        Popup.alert(`<p>${data.message}</p><a class='click'>朕知道了</a>`, 'popup')
        Popup.click('a.click')
        return
      }
      statistics({
        type: 'vip',
        tag: '马上拿特权跳转'
      })
      location.href = resolveUrl('http://h.xianjincard.com/activity/overlord/pay')
    })
  }

  reduction () {
    let time = new Date().getTime() - this.time
    if (this.type === 1) {
      this.setState({
        classA: 'active-index'
      })
    }
    if (this.type === 2) {
      this.setState({
        classB: 'active-index'
      })
    }
    if (this.type === 3) {
      this.setState({
        classC: 'active-index'
      })
    }
    setTimeout(() => {
      this.flag = 0
      this.setState({
        classA: '',
        classB: '',
        classC: '',
        overlay: {
          display: 'none'
        }
      })
    }, time > 1200 ? 1400 : time + 200)
  }

  showCard (type) {
    if (this.flag) {
      return
    }
    this.flag = 1
    this.type = type
    this.time = new Date().getTime()
    if (type === 1) {
      this.setState({
        classA: 'active active-index'
      })
    }
    if (type === 2) {
      this.setState({
        classB: 'active active-index'
      })
    }
    if (type === 3) {
      this.setState({
        classC: 'active active-index'
      })
    }
    this.setState({
      overlay: {
        display: 'block'
      }
    })
  }

  render () {
    const { classA, classB, classC, overlay } = this.state

    return (
      <div className='transition-group'>
        <div className='overlord'>
          <div className='card-content'>
            <div className={`card ${classA}`} onClick={() => this.showCard(1)}>
              <h4>申请<b>必过</b></h4>
              <h5>特权一</h5>
              <h6>必过</h6>
              <p>申请审核，借款通过率百分之百</p>
            </div>
            <div className={`card ${classB}`} onClick={() => this.showCard(2)}>
              <h4>服务费<b>全免</b></h4>
              <h5>特权二</h5>
              <h6>全免</h6>
              <p>特权期内，服务费全免</p>
            </div>
            <div className={`card ${classC}`} onClick={() => this.showCard(3)}>
              <h4 className='last'>仅限<b>1%</b></h4>
              <h5>特权三</h5>
              <h6>1%</h6>
              <p>如果你能看到这个页面，说明你就是千万现金卡用户中幸运的1%</p>
            </div>
          </div>
          <a className='button' onClick={this.privilege.bind(this)}>马上拿特权</a>
          <div className='rule'>
            <h2>霸王令说明须知</h2>
            <h3>平台现举办霸王令活动，为用户提供超值的服务。活动规则如下：</h3>
            <p><b>1、</b>“霸王令”活动期间，借款人在2个月有效期内，可获得4次免息借款机会，每次额度以当前最大授信额度为准，每次借款周期为14天。</p>
            <p>举例：用户目前的授信额度为1500元，现可享受2个月6000元的借款总额度，可以分4次支取。每次可支取1500元，使用期限为14天。</p>
            <p><b>2、</b>支取时间由借款人自行确认，自霸王令购买时间起后延60天有效期，过期无效</p>
            <p><b>3、</b>活动期间活动费为300元，一次性支付，与借款人的支取次数无关。借款人在确认参与“霸王令”活动后，不得以未实际使用支取次数为由申请退还全部或部分活动费。</p>
            <p><b>4、</b>借款人下一次的支取行为以对上一次支取行为的正常还款为前提。若是借款人逾期还款，则将失去霸王令服务中后续的支取次数，之前交付的300元活动费，不予退还。</p>
            <p><b>5、</b>此活动仅限在现金白卡app内申请借款有效。</p>
            <p><b>6、</b>本活动最终解释权归现金卡所有，与苹果公司无关</p>
          </div>
        </div>
        <div className='overlord-overlay' style={overlay} onClick={this.reduction.bind(this)} />
      </div>
    )
  }
}
