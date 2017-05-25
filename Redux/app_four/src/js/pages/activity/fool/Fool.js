import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import { get, share, login, hrefNative, platform, resolveUrl } from 'utils'
import 'scss/activity/fool.component.scss'

const appMarket = 'foolAct'
const rewardList = [[{'name': '叶*', 'tel': '187****2705', 'money': '1900'}], {'name': '蔡**', 'tel': '138****2705', 'money': '1000'}, {'name': '秦**', 'tel': '157****2705', 'money': '1000'}, {'name': '张*', 'tel': '133****2705', 'money': '2400'}, {'name': '曹*', 'tel': '130****2705', 'money': '1000'}, {'name': '王*', 'tel': '135****2705', 'money': '3000'}]
let [rewardList1 = [], ...rewardList2] = rewardList
let locked = 1

export default class Fool extends React.Component {
  constructor (props) {
    super(props)
    this.height = 0
    this.fontSize = 0
    this.state = {
      rewardFlag: false,
      styleFlag: true,
      arrowFlag: true,
      bgFlag: 'one',
      top: 5.9
    }
  }

  componentWillMount () {
    if (Math.floor(new Date().getTime() / 1000) < 1491062400) {
      this.setState({
        bgFlag: 'one'
      })
      return
    }
    if (Math.floor(new Date().getTime() / 1000) < 1491148800) {
      this.setState({
        bgFlag: 'two'
      })
      return
    }
    if (Math.floor(new Date().getTime() / 1000) < 1491235200) {
      this.setState({
        bgFlag: 'three'
      })
    }
    if (Math.floor(new Date().getTime() / 1000) >= 1491235200) {
      this.setState({
        bgFlag: 'four'
      })
    }
  }

  componentDidMount () {
    document.title = '愚人节不愚人'
    share('Temporary')
    this.height = document.querySelector('table.table').offsetHeight
    this.fontSize = parseFloat(document.querySelector('html').style.fontSize)
  }

  lookReward (e) {
    if (rewardList.length < 2) {
      locked = 0
    }
    if (locked) {
      locked = 0
      const { rewardFlag, styleFlag, arrowFlag, top } = this.state
      if (!rewardFlag) {
        this.setState({
          top: top + (this.height / this.fontSize)
        })
      } else {
        this.setState({
          top: top - (this.height / this.fontSize)
        })
      }
      this.setState({
        rewardFlag: !rewardFlag
      })
      if (!styleFlag) {
        setTimeout(() => {
          this.setState({
            styleFlag: !styleFlag,
            arrowFlag: !arrowFlag
          })
          locked = 1
        }, 400)
        return
      }
      this.setState({
        styleFlag: !styleFlag
      })
      setTimeout(() => {
        locked = 1
        this.setState({
          arrowFlag: !arrowFlag
        })
      }, 400)
    }
  }

  receive (e) {
    get('http://credit.xianjincard.com/activity/default/act-flag-user?key=temporaryAct_reg&tag=h5-20170401-temporaryAct_reg').then(data => data.data).then(data => {
      if (data.code !== 0) {
        if (data.code === -1001) {
          Popup.alert(Content.errorHtml(data.code), 'popup popup-login')
          Popup.click('a.click', () => { login(appMarket) })
          return
        }
        Popup.alert(Content.errorHtml(data.code), 'popup')
        return
      }
      if (!platform.isApp) {
        window.location.href = resolveUrl('http://h5.xianjincard.com/mobile')
      }
      hrefNative(4)
    })
  }

  render () {
    const { rewardFlag, styleFlag, arrowFlag, top, bgFlag } = this.state

    const tContent1 = rewardList1.length > 0 ? rewardList1.map((v, i) => <tr key={i}><td>{v.name}</td><td>{v.tel}</td><td>{v.money}</td></tr>) : <tr><td className='no-date' colSpan='3'>虚位以待</td></tr>
    const tContent2 = rewardList2.length > 0 ? rewardList2.map((v, i) => <tr key={i}><td>{v.name}</td><td>{v.tel}</td><td>{v.money}</td></tr>) : null
    const icon = rewardList2.length > 0 ? <div className='arrow' style={{top: `${top}rem`}} onClick={this.lookReward.bind(this)}>
      <i className={`${arrowFlag ? '' : 'down'}`} />
    </div> : null

    return (
      <div className='transition-group'>
        <div className={`fool ${bgFlag}`}>
          <a className='receive' onClick={this.receive.bind(this)}>
            <span>领取借钱不用还特权</span>
          </a>
          <div className='reward'>
            <div className='reward-num'>
              <p>4月4日双色球号码为：<b>01040813242705</b></p>
              <p>中奖尾号为：<b>2705</b></p>
            </div>
            <a className='reward-a' onClick={this.lookReward.bind(this)}>获奖名单</a>
            <div className='reward-list'>
              <table>
                <thead>
                  <tr>
                    <td>姓名</td>
                    <td>电话</td>
                    <td>返现本金</td>
                  </tr>
                </thead>
                <tbody>
                  {tContent1}
                </tbody>
              </table>
              <table className={`table ${rewardFlag ? 'active' : 'disabled'}`} style={{position: `${styleFlag ? 'absolute' : ''}`}}>
                <tbody>
                  {tContent2}
                </tbody>
              </table>
            </div>
            {icon}
          </div>
          <div className='rule'>
            <h3><span>活动规则</span></h3>
            <div className='rule-content'>
              <p>一、活动时间：2017.04.01.10:00—04.04.21:00</p>
              <p>二、参与资格：通过点击“领取借钱不用还特权”按钮进入申请，方有资格领取奖励</p>
              <p>三、奖励规则</p>
              <p class='orange'>1.免本免息</p>
              <p>活动期间借款成功的用户，注册手机尾号与4月4日双色球开奖号码后四位匹配的，可获得免本免息特权</p>
              <p class='orange'>2.新手免息</p>
              <p>活动期间所有新注册且申请借款的用户均可获取免息券一张，有效期20天，每人限领一次</p>
              <p>四、免本免息特权用户名单将于活动结束后次日上午12:00前公布，同时将收到短信提醒，如有疑问请关注现金白卡公众号"xjbk88”咨询</p>
              <p>五、本活动最终解释权归现金卡所有，与Apple.Inc无关</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
