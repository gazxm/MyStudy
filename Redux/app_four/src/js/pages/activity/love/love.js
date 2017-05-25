import React from 'react'
import Barrage from './Barrage'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { redirect, share } from 'utils'
import 'scss/activity/love.component.scss'

const data = {color: ['#535353', '#eb6100', '#ee4250'], length: 10, data: [{word: '朱静我爱你'}, {word: '如果可以我不想得到你的消息'}, {word: '子青，我喜欢你'}, {word: '李子，到现在我还是会想起你的名字'}, {word: '喜欢LYF'}, {word: '雅迪我喜欢你，但是却不能告诉你'}, {word: '花蕾，我们在一起吧'}, {word: '妮可我爱你'}, {word: '程书羽我爱你永远不变'}, {word: '李锦我喜欢你'}, {word: '晓雪我要和你在一起'}, {word: '苟芸慧，爱你爱你'}, {word: '闳静，我想娶你'}, {word: 'Joanna我要娶你'}, {word: '单身久了反而不习惯了'}, {word: '天王斗地主，宝塔镇河妖'}, {word: '一生不离不弃~'}, {word: '望云，撒浪嘿哟~ 在一起啊！'}, {word: '小静我爱你'}, {word: '张婷我爱你'}, {word: '我爱你'}, {word: '在一起'}, {word: '李静爱就在一起'}, {word: '袁佳，永远不分离'}, {word: '庄欢，要你'}, {word: '玲玲，我们结婚吧!'}, {word: '小慧，我们结婚吧~'}, {word: '爱要在一起'}, {word: '我喜欢你倩倩'}, {word: '我爱你丽萍……'}, {word: '范冰冰我爱你~'}, {word: '胖迪，我要你'}, {word: '高圆圆，我要和你一起'}, {word: '我单身我自豪'}, {word: '请不要撒狗粮了，怒！'}, {word: '又要花钱了，还好有现金卡'}, {word: '谁给我钱，我爱谁'}, {word: '我最爱钱，钱快来啦'}, {word: '小雨，我爱你爱你'}, {word: '爱你'}, {word: '最美不过你的颜'}, {word: '谁人不爱你呀，我的钱'}, {word: '我爱毛爷爷'}, {word: '毛爷爷，快到碗里来'}, {word: '快给我放款，没钱了'}, {word: '女神，我爱你'}, {word: '还记得那一夜吗'}, {word: '姑娘、面包和酒都会有的'}, {word: '春风沉醉的夜晚还有你'}, {word: '最难丢弃的就是忘不掉'}]}
let speakFlag = 1
let toastFlag = 1
let time = 10
let timeInterval = null

export default class Love extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      inputData: '',
      text: '',
      timeFlag: 0
    }
  }

  componentDidMount () {
    document.title = '520大胆爱'
    share('love')
    this.judgementTime()
  }

  judgementTime () {
    const nowTime = Math.floor(new Date().getTime() / 1000)
    if (nowTime < 1495159200) {
      Popup.alert(`<p>活动将于5月19日10点开启<br />等你哦~</p><a class='click'>朕知道了</a>`, 'popup')
      Popup.click('a.click')
      this.setState({
        timeFlag: 1
      })
    }
    if (nowTime > 2495382400) {
      Popup.alert(`<p>活动已经结束啦~<br />请关注现金卡其他活动吧</p><a class='click'>朕知道了</a>`, 'popup')
      Popup.click('a.click')
      this.setState({
        timeFlag: 2
      })
    }
  }

  handle (tag) {
    const { timeFlag } = this.state
    if (timeFlag === 1) {
      Popup.alert(`<p>活动将于5月19日10点开启<br />等你哦~</p><a class='click'>朕知道了</a>`, 'popup')
      Popup.click('a.click')
      return
    }
    if (timeFlag === 2) {
      Popup.alert(`<p>活动已经结束啦~<br />请关注现金卡其他活动吧</p><a class='click'>朕知道了</a>`, 'popup')
      Popup.click('a.click')
      return
    }
    redirect.push(`/integral-mall/details?id=${tag}`)
  }

  showInput () {
    const { timeFlag } = this.state
    if (timeFlag === 1) {
      Popup.alert(`<p>活动将于5月19日10点开启<br />等你哦~</p><a class='click'>朕知道了</a>`, 'popup')
      Popup.click('a.click')
      return
    }
    if (timeFlag === 2) {
      Popup.alert(`<p>活动已经结束啦~<br />请关注现金卡其他活动吧</p><a class='click'>朕知道了</a>`, 'popup')
      Popup.click('a.click')
      return
    }
    if (speakFlag) {
      Popup.alert(`<p><input id='text' placeholder='我有话要说(不能超过20个字哦~)' maxlength='20' /></p><a class='click'>发送</a>`, 'popup')
      Popup.click('a.click', () => this.speak(Popup.dom.querySelector('input').value))
    } else {
      if (toastFlag) {
        toastFlag = 0
        Toast.info(`请等待${time}s再发送弹幕哦`, 2)
        setTimeout(() => {
          toastFlag = 1
        }, 2000)
      }
    }
  }

  speak (value) {
    speakFlag = 0
    time = 10
    clearInterval(timeInterval)
    setTimeout(() => {
      speakFlag = 1
    }, 10000)
    timeInterval = setInterval(() => {
      time--
    }, 1000)
    this.setState({
      inputData: value
    })
  }

  render () {
    const { inputData, timeFlag } = this.state

    return (
      <div className='transition-group'>
        <div className='love '>
          <button className='btn btn1' onClick={() => this.handle(13)}>
            <span>用心爱</span>
          </button>
          <button className='btn btn2' onClick={() => this.handle(12)}>
            <span>用心爱</span>
          </button>
          <button className='btn btn3' onClick={() => this.handle(17)}>
            <span>用心爱</span>
          </button>
          <button className='btn btn4' onClick={() => this.handle(19)}>
            <span>用心爱</span>
          </button>
          <Barrage data={data} inputData={inputData} timeFlag={timeFlag} />
          <button className='bt' onClick={this.showInput.bind(this)}>
            <span>爱要说出来</span>
          </button>
          <p>本活动最终解释权归现金卡所有，与Apple.Inc无关。</p>
        </div>
      </div>
    )
  }
}
