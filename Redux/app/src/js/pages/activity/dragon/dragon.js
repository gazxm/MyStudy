import React from 'react'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import 'scss/activity/dragon.component.scss'
import { get, login, goHome, share } from 'utils'
import 'img/activity/dragon/tc_01.png'
import 'img/activity/dragon/tc_02.png'
import 'img/activity/dragon/tc_03.png'
import 'img/activity/dragon/tc_04.png'
export default class Dragon extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      animClass: ''
    }
  }

  componentDidMount () {
    document.title = '"粽"情借 不用还'
    share('dragon')
    setTimeout(() => {
      this.setState({
        animClass: 'anim1'
      })
    })
    setTimeout(() => {
      this.setState({
        animClass: 'anim1 anim2'
      })
    }, 2500)
  }

  receive () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/default/act-flag-user?key=noNeedRepay_act&tag=h5-20170426-noNeedRepay_act').then(data => data.data).then(data => {
      Toast.hide()
      console.log(data)
      if (data.code === -1001) {
        Popup.alert(`<p>你还没有登录哦</p><span class="s1"></span><span class="s2"></span>
          <span class="s3"></span>
          <span class="s4"></span>
          <span class="s5"></span>
          <span class="s6"></span>
          <span class="s7"></span>
          <a class='click'>立即登录</a>`, 'popup2')
        Popup.click('a.click', login)
        return
      }
      if (data.code !== 0 && data.code !== -2025) {
        if (data.code === -2012 || data.code === -2013) {
          Popup.alert(`<p>${data.code === -2012 ? '活动还没有开始哦' : '活动已经结束啦'}</p>
            <span class="s1"></span>
            <span class="s2"></span>
            <span class="s3"></span>
            <span class="s4"></span>
            <span class="s5"></span>
            <span class="s6"></span>
            <span class="s7"></span>
            <a class='click'>知道啦</a>`, data.code === -2012 ? 'popup3' : 'popup4')
          Popup.click('a.click')
          return
        }
        Popup.alert(`<p>服务器繁忙，请稍后再试</p><span class="s1"></span><span class="s2"></span>
          <span class="s3"></span>
          <span class="s4"></span>
          <span class="s5"></span>
          <span class="s6"></span>
          <span class="s7"></span>
          <a class='click'>知道啦</a>`, 'popup5')
        Popup.click('a.click')
        return
      }
      goHome()
    })
  }

  render () {
    const { animClass } = this.state
    return (
      <div className='transition-group'>
        <div className='dragon'>
          <div className='head'>
            <i className={`zz1 ${animClass}`} />
            <i className={`zz2 ${animClass}`} />
            <i className={`zz3 ${animClass}`} />
            <i className={`zz4 ${animClass}`} />
          </div>
          <div className='content'>
            <i className={`yz1 ${animClass}`} />
            <i className={`yz2 ${animClass}`} />
            <i className={`yz3 ${animClass}`} />
            <i className={`yz4 ${animClass}`} />
          </div>
          <div className='btn'>
            <button className='btn1' onClick={this.receive.bind(this)} />
            <p>端午助力加油站&nbsp;&nbsp;随时借钱随时花</p>
          </div>
          <button className='btn2' onClick={() => {
            Popup.alert(`<h3>活动规则</h3>
              <div class="p1"><p>一、参与资格：</p>
              <p>平台注册用户通过点击<span>“粽”情借</span>按钮进入申请，可有机会本息全免资格。</p></div>
              <div class="p1"><p>二、本息全免资格</p>
              <p>1.5月27日10:00-5月30日21:00借款成功的用户，注册手机尾号与5月30日双色球开奖号码后四位匹配的用户，获得免本免息资格</p>
              <p>2.5月30日21:00-5月31日15:00申请借款用户手机尾号与5月31日上证收盘指数尾号后4位（含小数）匹配的用户可获得免本免息资格
              </p></div>
              <div class="p1"><p>三、本息返还时间</p>
              <p>中奖用户按时还款后，三个工作日内将该笔免本息现金发放至个人绑定的银行卡中。
              </p></div>
              <div class="p1"><p>四、中奖名单当于活动结束后当日18:00前公布，并发送短信至中奖用户，如有疑问请关注现金白卡公众号“xjbk88"咨询。</p></div>
              <div class="p1"><p>五、本活动最终解释权归现金卡所有，与Apple.inc无关。
              </p></div>
              <img class="img1" src="../../../../assets/img/activity/dragon/tc_01.png" alt=""/>
              <img class="img2" src="../../../../assets/img/activity/dragon/tc_02.png" alt=""/>
              <img class="img3" src="../../../../assets/img/activity/dragon/tc_03.png" alt=""/>
              <img class="img4" src="../../../../assets/img/activity/dragon/tc_04.png" alt=""/>
              <a class='click'>知道啦</a>`, 'popup1')
            Popup.click('a.click')
          }} />

        </div>
      </div>
    )
  }
}
