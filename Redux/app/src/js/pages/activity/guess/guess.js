import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, share, redirect, login, resolveUrl } from 'utils'
import 'scss/activity/guess.component.scss'

export default class Guess extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {
        cur_topic: null,
        pre_topic: null,
        gold: 0,
        login: 0,
        activity: 0
      },
      code: 0
    }
  }

  componentWillMount () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/topic-quiz-act/index').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        this.setState({
          data: data.data,
          code: data.code
        })
        if (data.code !== -2012 && data.code !== -2013) {
          Popup.alert(Content.showHtml(data.code), 'popup')
          Popup.click('a.click')
        }
        return
      }
      this.setState({
        data: data.data
      })
    })
  }

  componentDidMount () {
    document.title = '全民猜猜猜'
    share('Guess')
  }

  lookPast () {
    const { data } = this.state
    if (!data.login) {
      Popup.alert(Content.showHtml(-1001), 'popup')
      Popup.click('a.click', login)
      return
    }
    redirect.push('/activity/guess/topic')
  }

  showRule () {
    const { data } = this.state
    Popup.alert(Content.showRule(data.cur_topic ? data.cur_topic.gold_score : 100), 'popup-rule')
  }

  forwardLogin () {
    login()
  }

  forwardGold () {
    location.href = resolveUrl('http://h.xianjincard.com/signin/detailed')
  }

  showStake (type) {
    const { data, code } = this.state
    if (code !== 0) {
      Popup.alert(Content.showHtml(code), 'popup')
      Popup.click('a.click')
      return
    }
    if (!data.login) {
      Popup.alert(Content.showHtml(-1001), 'popup')
      Popup.click('a.click', login)
      return
    }
    if (!data.activity) {
      Popup.alert(Content.showHtml(-2017), 'popup')
      Popup.click('a.click')
      return
    }
    if (!data.cur_topic) {
      Popup.alert(Content.showHtml(-2100), 'popup')
      Popup.click('a.click')
      return
    }
    Popup.alert(Content.showStake(data.cur_topic.gold_score, data.gold, type), 'popup-stake')
    let bNum = Popup.dom.querySelector('span.b-num')
    let rNum = Popup.dom.querySelector('span.r-num')
    let goldText = Popup.dom.querySelector('span.gold')
    Popup.click('a.click', () => {
      const pbNum = bNum ? parseInt(bNum.innerText) : 0
      const prNum = rNum ? parseInt(rNum.innerText) : 0
      if (pbNum === 0 && prNum === 0) {
        Popup.alert(Content.showHtml(-2101), 'popup')
        Popup.click('a.click')
        return
      }
      Toast.loading('')
      get(`http://credit.xianjincard.com/activity/topic-quiz-act/stake?q_num=${pbNum}&a_num=${prNum}`).then(data => data.data).then(data => {
        Toast.hide()
        Popup.alert(Content.showHtml(data.code), 'popup')
        if (data.code === -1001) {
          Popup.click('a.click', login)
          return
        }
        if (data.code === -2031) {
          Popup.click('a.click', () => {
            redirect.push('/signin')
          })
          return
        }
        Popup.click('a.click')
        if (data.code !== 0) {
          return
        }
        this.setState({
          data: {
            ...this.state.data,
            num: this.state.data.num + pbNum + prNum,
            gold: this.state.data.gold - parseInt(goldText.innerText),
            cur_topic: {
              ...this.state.data.cur_topic,
              my_blue_num: parseInt(this.state.data.cur_topic.my_blue_num) + pbNum,
              my_red_num: parseInt(this.state.data.cur_topic.my_red_num) + prNum
            }
          }
        })
      })
    })
    Popup.addEventListener('span.b-minus', 'click', () => {
      if (parseInt(bNum.innerText) > 0) {
        bNum.innerText = parseInt(bNum.innerText) - 1
        goldText.innerText = parseInt(goldText.innerText) - parseInt(data.cur_topic.gold_score)
      }
    })
    Popup.addEventListener('span.b-plus', 'click', () => {
      if (parseInt(bNum.innerText) < 100) {
        bNum.innerText = parseInt(bNum.innerText) + 1
        goldText.innerText = parseInt(goldText.innerText) + parseInt(data.cur_topic.gold_score)
      }
    })
    Popup.addEventListener('span.r-minus', 'click', () => {
      if (parseInt(rNum.innerText) > 0) {
        rNum.innerText = parseInt(rNum.innerText) - 1
        goldText.innerText = parseInt(goldText.innerText) - parseInt(data.cur_topic.gold_score)
      }
    })
    Popup.addEventListener('span.r-plus', 'click', () => {
      if (parseInt(rNum.innerText) < 100) {
        rNum.innerText = parseInt(rNum.innerText) + 1
        goldText.innerText = parseInt(goldText.innerText) + parseInt(data.cur_topic.gold_score)
      }
    })
  }

  render () {
    const { data } = this.state
    const squadCount = data.pre_topic ? data.pre_topic.squad_count : null
    const againstCount = data.pre_topic ? data.pre_topic.against_count : null
    const widthOne = (squadCount / (parseInt(squadCount) + parseInt(againstCount))) * 100 + '%'
    const widthTwo = (againstCount / (parseInt(squadCount) + parseInt(againstCount))) * 100 + '%'

    return (
      <div className='transition-group'>
        <div className='guess'>
          <div className='head'>
            <span onClick={this.showRule.bind(this)}>规则说明</span>
          </div>
          <h3>押少数方&nbsp;赢双倍金币</h3>
          {data.cur_topic ? <div className='content-1'>
            <div className='content-head'>
              <a className={data.cur_topic.link ? 'underline' : ''} href={data.cur_topic.link ? data.cur_topic.link : null}>{data.cur_topic.title}</a>
            </div>
            <p className='word'>今晚24点开奖，截至10分钟前本次累计押注{data.num}注</p>
            <div className='content-bottom'>
              <div className='content-left' onClick={() => this.showStake(1)}>
                <p className='p1'>{data.cur_topic.squad_title}</p>
                <p className='p2'>{data.cur_topic.squad_desc}</p>
              </div>
              <span />
              <div className='content-right' onClick={() => this.showStake(2)}>
                <p className='p1'>{data.cur_topic.against_title}</p>
                <p className='p2'>{data.cur_topic.against_desc}</p>
              </div>
              {data.login ? <p className='b-stake'>您当前已押{data.cur_topic.my_blue_num}注</p> : <p className='b-stake' onClick={this.forwardLogin.bind(this)}>请先登录哦</p>}
              {data.login ? <p className='r-stake'>您当前已押{data.cur_topic.my_red_num}注</p> : <p className='r-stake' onClick={this.forwardLogin.bind(this)}>请先登录哦</p>}
            </div>
          </div> : <div className='content-1'><p className='no-data'>当前暂时没有话题哦~</p></div>}
          {data.pre_topic ? <div className='content-2'>
            <ul>
              <li><p className='lp1'>上期话题</p></li>
              <li><a className={data.pre_topic.link ? 'lp2 underline' : 'lp2'} href={data.pre_topic.link ? data.pre_topic.link : null}>{data.pre_topic.title}</a></li>
              <li><p className='lp3'>上期结果 <span className='sp4'>{data.pre_topic.result_text}</span></p>
                <div className='sp1'><span className='sp2' style={{width: widthOne}}><b>蓝{squadCount}注</b></span><span className='sp3' style={{width: widthTwo}}>红{againstCount}注</span></div>
              </li>
              <li><p className='lp4'>上期最佳 <span className='sp4'>{data.pre_topic.best_user_text}</span></p></li>
              <li><p className='lp4'>我的押注 {data.login ? data.pre_topic.my_blue_num && data.pre_topic.my_red_num ? <span className='sp4'><span className='blue'>押蓝{data.pre_topic.my_blue_num}注</span><span className='red'>押红{data.pre_topic.my_red_num}注</span></span> : <span className='sp4'>没有参与本场活动</span> : <span className='sp4 blue' onClick={this.forwardLogin.bind(this)}>请先登录哦</span>}{data.login ? <span className='sp5 blue' onClick={this.forwardGold.bind(this)}>查看我的金币</span> : null}</p></li>
              <li><p className='lp5' onClick={this.lookPast.bind(this)}>查看往期话题></p></li>
            </ul>
          </div> : <div className='content-2 content-no-data'><p className='no-data'>暂时没有往期话题哦~</p></div>}
          <button onClick={() => this.showStake(3)}>我要押注</button>

        </div>
      </div>
    )
  }
}
