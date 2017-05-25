import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import { Tabs, WhiteSpace } from 'antd-mobile'
import { get, login, goHome, platform } from 'utils'
import 'scss/activity/notback.component.scss'

const TabPane = Tabs.TabPane
const appMarket = 'notback'
export default class notBack extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: '1'
    }
  }

  componentWillMount () {
    this.setState({
      tab: '3'
    })
  }

  componentDidMount () {
    document.title = '借钱不用还'
  }

  receive () {
    get('http://credit.xianjincard.com/activity/default/act-flag-user?key=tempAct_act&tag=h5-20170410-tempAct_act').then(data => data.data).then(data => {
      if (data.code !== 0) {
        if (data.code === -1001) {
          Popup.alert(Content.errorHtml(data.code), 'popup popup-login')
          Popup.click('a.click', () => { login(appMarket) })
          return
        }
        if (data.code === -2003) {
          if ((platform.version === '1.4.8' || platform.version === '1.4.9') && platform.isIos) {
            Popup.alert(Content.errorHtml(-2004), 'popup popup-login')
            Popup.click('a.click')
            return
          }
          Popup.alert(Content.errorHtml(data.code), 'popup popup-login')
          Popup.click('a.click', () => { goHome() })
          return
        }
        Popup.alert(Content.errorHtml(data.code), 'popup')
        return
      }
      goHome()
    })
  }

  render () {
    const { tab } = this.state

    return (
      <div className='transition-group'>
        <div className='notBack'>
          <a className='receive' onClick={this.receive.bind(this)}>
            <span>领取免本息特权</span>
          </a>
          <div className='reward'>
            <div className='reward-num'>
              <p>4月12日上证收盘指数：<b>3273.83</b></p>
              <p>中奖尾号为：<b>7383</b></p>
            </div>
            <a className='reward-a'>获奖名单</a>
            <div className='reward-list'>
              <Tabs defaultActiveKey={tab} swipeable={false}>
                <TabPane tab='4.10日名单' key='1'>
                  <table>
                    <thead>
                      <tr>
                        <td>姓名</td>
                        <td>电话</td>
                        <td>返现本金</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>吴*</td>
                        <td>182****6939</td>
                        <td>1600</td>
                      </tr>
                      <tr>
                        <td>郑*</td>
                        <td>137****6939</td>
                        <td>2400</td>
                      </tr>
                      <tr>
                        <td>王**</td>
                        <td>158****6939</td>
                        <td>1800</td>
                      </tr>
                      <tr>
                        <td>李**</td>
                        <td>131****6939</td>
                        <td>2200</td>
                      </tr>
                      <tr>
                        <td>杨**</td>
                        <td>173****6939</td>
                        <td>1500</td>
                      </tr>
                    </tbody>
                  </table>
                </TabPane>
                <TabPane tab='4.11日名单' key='2'>
                  <table>
                    <thead>
                      <tr>
                        <td>姓名</td>
                        <td>电话</td>
                        <td>返现本金</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>朱*</td>
                        <td>137****8897</td>
                        <td>3000</td>
                      </tr>
                      <tr>
                        <td>谢*</td>
                        <td>139****8897</td>
                        <td>1800</td>
                      </tr>
                      <tr>
                        <td>许*</td>
                        <td>181****8897</td>
                        <td>1500</td>
                      </tr>
                      <tr>
                        <td>方**</td>
                        <td>150****8897</td>
                        <td>2000</td>
                      </tr>
                      <tr>
                        <td>罗**</td>
                        <td>171****8897</td>
                        <td>2100</td>
                      </tr>
                      <tr>
                        <td>张**</td>
                        <td>188****8897</td>
                        <td>3300</td>
                      </tr>
                    </tbody>
                  </table>
                </TabPane>
                <TabPane tab='4.12日名单' key='3'>
                  <table>
                    <thead>
                      <tr>
                        <td>姓名</td>
                        <td>电话</td>
                        <td>返现本金</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>冯*</td>
                        <td>182****7383</td>
                        <td>2200</td>
                      </tr>
                      <tr>
                        <td>伍*</td>
                        <td>137****7383</td>
                        <td>1900</td>
                      </tr>
                      <tr>
                        <td>罗*</td>
                        <td>180****7383</td>
                        <td>1500</td>
                      </tr>
                      <tr>
                        <td>赵*</td>
                        <td>131****7383</td>
                        <td>2800</td>
                      </tr>
                      <tr>
                        <td>范**</td>
                        <td>150****7383</td>
                        <td>2800</td>
                      </tr>
                      <tr>
                        <td>汪**</td>
                        <td>159****7383</td>
                        <td>1800</td>
                      </tr>
                      <tr>
                        <td>席**</td>
                        <td>139****7383</td>
                        <td>2300</td>
                      </tr>
                      <tr>
                        <td>宋**</td>
                        <td>177****7383</td>
                        <td>2600</td>
                      </tr>
                    </tbody>
                  </table>
                </TabPane>
              </Tabs>
              <WhiteSpace />
            </div>
          </div>
          <div className='rule'>
            <h3><span>活动规则</span></h3>
            <div className='rule-content'>
              <p>一、活动时间：2017.04.10.10:00—04.12.15:00</p>
              <p>二、参与资格：通过点击“领取免本息特权”按钮进入申请，方有资格领取奖励</p>
              <p>三、奖励规则</p>
              <p>活动期间借款成功的用户，注册手机尾号与上证指数收盘价后四位（含小数点）匹配的，可获得免本免息特权。中奖用户按时还款后，三个工作日内现金卡官方将该笔免本息现金发放到个人绑定的银行卡中。</p>
              <p className='small'><b>备注：</b>4月10日10:00-15:00内借款成功的用户，以4月10日收盘价为准，计入4月10日获奖系统；4月10日15:00-4月11日15:00内借款成功的用户，以4月11日收盘价为准，计入4月11日获奖系统；4月11日15:00-4月12日15:00内借款成功的用户，以4月12日收盘价为准，计入4月12日获奖系统</p>
              <p>四、每天免本息特权用户名单将于中奖当日18:00前公布，并发送短信至获奖用户，如有疑问请关注现金白卡公众号"xjbk88”咨询</p>
              <p>五、本活动最终解释权归现金卡所有，与Apple.Inc无关</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
