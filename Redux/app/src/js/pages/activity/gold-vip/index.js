
import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { Tabs, WhiteSpace } from 'antd-mobile'
import { get, share, login, goHome, goCertification } from 'utils'
import 'scss/activity/gold-vip.component.scss'
const TabPane = Tabs.TabPane

export default class Vip extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: '1'
    }
  }

  componentWillMount () {
    this.setState({
      tab: '1'
    })
  }

  componentDidMount () {
    document.title = '金卡专享'
    share('Vip')
  }

  showRule () {
    Popup.alert(Content.showRule(), 'popup-rule')
    Popup.click('a.click')
  }

  receive () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/default/act-flag-user?key=tempAct_act').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup')
        if (data.code === -1001) {
          Popup.click('a.click', login)
          return
        }
        if (data.code === -2003) {
          Popup.click('a.click', goCertification)
          return
        }
        Popup.click('a.click', 'popup')
        return
      }
      goHome()
    })
  }

  render () {
    const { tab } = this.state
    return (
      <div className='transition-group'>
        <div className='vip'>
          <p className='date'>活动时间：2017.6.14-6.30</p>
          <div className='rule' onClick={this.showRule.bind(this)}>活动规则</div>
          <button className='btn' onClick={this.receive.bind(this)}>立即申请</button>
          <div className='list-1'>
            <table>
              <thead>
                <tr>
                  <td>6月16日上证指数收盘价</td>
                  <td>获奖手机尾号</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='no-date' colSpan='2'>敬请期待</td>
                </tr>
              </tbody>
            </table>
            <table >
              <thead>
                <tr>
                  <td>6月23日上证指数收盘价</td>
                  <td>获奖手机尾号</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='no-date' colSpan='2'>敬请期待</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='list-2'>
            <Tabs defaultActiveKey={tab} swipeable={false}>
              <TabPane tab='第一批中奖名单' key='1'>
                <table>
                  <thead>
                    <tr>
                      <td>获奖用户</td>
                      <td>手机号</td>
                      <td>返现金额</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='no-date' colSpan='3'>虚位以待</td>
                    </tr>
                  </tbody>
                </table>
              </TabPane>
              <TabPane tab='第二批中奖名单' key='2'>
                <table>
                  <thead>
                    <tr>
                      <td>获奖用户</td>
                      <td>手机号</td>
                      <td>返现金额</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='no-date' colSpan='3'>虚位以待</td>
                    </tr>
                  </tbody>
                </table>
              </TabPane>
              <TabPane tab='第三批中奖名单' key='3'>
                <table>
                  <thead>
                    <tr>
                      <td>获奖用户</td>
                      <td>手机号</td>
                      <td>返现金额</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='no-date' colSpan='3'>虚位以待</td>
                    </tr>
                  </tbody>
                </table>
              </TabPane>
            </Tabs>
            <WhiteSpace />
          </div>
        </div>
      </div>
    )
  }
}
