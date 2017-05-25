import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, login, goHome, share } from 'utils'
import 'scss/activity/laborday.component.scss'

const appMarket = 'laborday'

export default class Laborday extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    document.title = '五一免息'
    share('laborday')
  }

  receive () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/default/act-flag-user?key=noNeedRepay_act&tag=h5-20170426-noNeedRepay_act').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0 && data.code !== -2025) {
        Popup.alert(Content.showHtml(data.code), 'popup')
        if (data.code === -1001) {
          Popup.click('a.click', () => { login(appMarket) })
          return
        }
        Popup.click('a.click')
        return
      }
      Popup.alert(Content.showHtml(0), 'popup')
      Popup.click('a.click', goHome)
    })
  }

  render () {
    return (
      <div className='transition-group'>
        <div className='laborday'>
          <a className='sub' onClick={this.receive.bind(this)}>免本免息入口 >></a>
          <h3>活动说明</h3>
          <div className='rule-content'>
            <p>一、参与资格：</p>
            <p>平台注册用户通过点击“免本免息入口”按钮进入申请，可有机会获得本息全免资格。</p>
            <p>二、本息全免资格</p>
            <p>1.4月28日10:00-4月30日21:00借款成功的用户，注册手机尾号与4月30日双色球开奖号码后四位匹配的用户，获得免本免息资格</p>
            <p>2.4月30日21:00-5月2日15:00申请借款用户手机尾号与5月2日上证收盘指数尾号后四位（含小数）匹配的用户可获得免本息资格</p>
            <p>三、本息返还时间</p>
            <p>中奖用户按时还款后，三个工作日内将该笔免本息现金发放至个人绑定的银行卡中。</p>
            <p>四、中奖名单当于活动结束后次日18:00前公布，并发送短信至中奖用户，如有疑问请关注现金白卡公众号“xjbk88"咨询。</p>
            <p>五、本活动最终解释权归现金卡所有，与Apple.Inc无关。</p>
          </div>
          <h4><b>获奖名单</b>查询，请扫二维码</h4>
          <i />
        </div>
      </div>
    )
  }
}
