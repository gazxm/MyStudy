import React from 'react'
import Popup from '../components/Popup'
import {Carousel} from 'antd-mobile'
import Toast from '../../../components/Toast'
import { get, post, login, goHome,goCoupon,goSignin,resolveUrl, platform, callBrowser,statistics, share } from 'utils'
import Slick from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'scss/activity/release.component.scss'

import 'img/activity/release/cover1.jpg'
import 'img/activity/release/cover2.jpg'
import 'img/activity/release/cover3.jpg'

let timerInterval = null
// let timerInterval = null

export default class Release extends React.Component {
  state = {}
  // awardList = []
  constructor (props) {
    super(props)
    this.state = {
      isLogin: false,   // 是否已经登录
      isActive: false,  // 活动是否已经开始
      groupIngStatue: true,  // 活动进行中状态
      signal1Class: '',
      signal2Class: '',
      signal1:'（完成以下任务可获暗号）',
      signal2:'（完成以下任务可获暗号）',
      isLoadServerInfoOk:false
    }

    this.config = {};
    // 活动预热时间
    this.config.preheatTime = 0 //1500861600, // 7月24日10:00
    // 活动开始时间
    this.config.startTime =  1500998400     // 7月26日0:00
    // 活动结束时间
    this.config.endTime = 1501084800  // 7月27日00:00
    // 直播开始时间
    this.config.zhiboStartTime =  undefined

    // this.config.zhiboStartTime =  new Date().getTime() / 1000 -1000
    // this.config.startTime = (new Date().getTime() / 1000) + 5 //test
    this.severTimeSpan = 0
  }

  componentWillMount () {
    this.createAwardList(40)
    this.initData()
  }

  componentDidMount () {
    document.title = '狂欢盛典，年中钜献'
    share('conference_act')
  }

  getCurTime(){
    return Math.floor(new Date().getTime() / 1000) + this.severTimeSpan
  }

  // 初始化值
  initData(){
    get('http://credit.xianjincard.com/activity/conference-act/index').then(data => {
      if(data.data.code == 0 ){
        if(!data.data.data.is_login){
        //强制登录
          let loginBoxCloseCB = null
          loginBoxCloseCB = ()=>{
            //调用ajax 获取登录状态, 如果没有登录则弹框
            Popup.alert(`<p class='short login-popup'>小主，你还没有登录哦</p><a class='click'>立即登录</a>`, 'popup', loginBoxCloseCB, {'overlay': false, 'span': false})
            Popup.click('a.click', login)
          }
          Popup.alert(`<p class='short login-popup'>小主，你还没有登录哦</p><a class='click'>立即登录</a>`, 'popup', loginBoxCloseCB, {'overlay': false, 'span': false})
          Popup.click('a.click', login)

        }
          //暗号区
        let signal1 = data.data.data.signal1,
          signal2 = data.data.data.signal2,
          signal1Class = signal1.length>0 ? 'noline' : '',
          signal2Class = signal2.length>0 ? 'noline' : '';
        signal1 = signal1.length>0 ? ` ${signal1}` : ('（完成以下任务可获暗号）');
        signal2 = signal2.length>0 ? ` ${signal2}` : '（完成以下任务可获暗号）';

        this.config.endTime = data.data.data.sub_end
        this.config.startTime =  data.data.data.sub_start  //test 1500973200
        this.config.zhiboStartTime = data.data.data.live_time  //test1500912000
        this.severTimeSpan =  parseInt( data.data.data.cur_time) -parseInt(new Date().getTime()/1000)

        this.showBlock()
        
        this.setState({
          signal1 : signal1 ,
          signal2 : signal2 ,
          signal1Class : signal1Class,
          signal2Class : signal2Class,
          isLogin: data.data.data.is_login,
          isLoadServerInfoOk: true
        })
        return
      }

      Toast.loading('系统错误,请稍后重试')
    })
  }
  // 领取返现券
  getAward () {
    statistics({
      type: 'release',
      tag: '点此领取'
    })
    const nowTime = this.getCurTime()
    if (!this.state.isLogin) {
      Popup.alert(`<p>您还未登录哦，请先登录</p><a class='click'>立即登录</a>`, 'popup')
      Popup.click('a.click', login)
      return
    }
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/conference-act/get-free').then(data => {
      Toast.hide()
      if (data.data.code == 0) {
        Popup.alert(`<p>获得` + data.data.data.value + `天返现券一张<br>仅限今日使用 </p><a class='click'>马上使用</a>`, 'popup')
        Popup.click('a.click',goHome)
        return;
      }
      Popup.alert(`<p>`+ data.data.message + `</p><a class='click'>朕知道了</a>`, 'popup')
      Popup.click('a.click')


    })
  }

  componentWillUnmount () {
    clearInterval(timerInterval)
  }
  slideBlock(){
    if( this.state.isActive ){
      let groupIng = document.querySelector('.group-ing')
      groupIng.style.height = this.state.groupIngStatue ? 0 : '3.1rem'
      this.setState({
        groupIngStatue : ! this.state.groupIngStatue
      })
      return
    }

    let groupWaiting = document.querySelector('.group-waiting')
    groupWaiting.style.height = this.state.groupIngStatue ? 0 : '0.7rem'
    this.setState({
      groupIngStatue : ! this.state.groupIngStatue
    })
  }
  // 顶部按时间初始化显示
  showBlock(){
    let nowTime = this.getCurTime();

    let isActive = nowTime>=this.config.startTime;
    this.setState({ isActive : isActive })
    if( isActive == false ){
      // 启动定时器 进行倒计时
      this.startTimer();
      // 两秒后, 收起神秘福利区域
      setTimeout(()=>{
        this.slideBlock()
      },2000)
    }
  }
  // 倒计时
  startTimer () {
    var that = this
    let timer = () => {
    // let time = this.state.rands.endTime - this.state.rands.nowTime
      let nowTime = this.getCurTime();
      let leftTime = this.config.startTime - nowTime;
      let d = Math.floor(leftTime / 60 / 60 / 24),
        h = d * 24 + Math.floor(leftTime / 60 / 60 % 24),
        m = Math.floor(leftTime / 60 % 60),
        s = Math.floor(leftTime % 60),
        newh = (h.toString().length<2)?'0'+h:h,
        newm = (m.toString().length<2)?'0'+m:m,
        news = (s.toString().length<2)?'0'+s:s;

      that.state.timerText = `<span><b>${newh}</b>:<b>${newm}</b>:<b>${news}</b></span>`

      let isActive = nowTime>=this.config.startTime;
      that.setState({ isActive : isActive })
      if( isActive == true ){
        // 关闭定时器 停止倒计时
        clearInterval(that.timerInterval)
        // 设置箭头为 折叠状态, 然后好让进行中的区域展开
        this.setState({ groupIngStatue : false })
        that.slideBlock()   // 手工调用显示进行中区域
        return ;
      }
    }
    this.timerInterval = setInterval(timer, 1000)
  }

  // 显示获奖记录
  record(){
    statistics({
      type: 'release',
      tag: '获奖记录'
    })

      Toast.loading('');
      get('http://credit.xianjincard.com/activity/conference-act/index').then(data => {

      Toast.hide()
      if(data.data.code==2012){
         Popup.alert(`<p>`+ data.data.message + `</p><a class='click'>朕知道了</a>`, 'popup')
        Popup.click('a.click')
        return
      }
      if(data.data.code==0){
        let temp = data.data.data.my_prizes,
          prizeRecord = '',
          moneyRecord = '';
          for(let i=0; i<temp.length; i++ ){
           let prize = temp[i];
           //狂欢记录
            if(prize.type==0){
              moneyRecord +=  temp[i].value + temp[i].unit + temp[i].name +`<br>`
            }
            //解码抽奖
            if(prize.type!==0){
              prizeRecord +=  temp[i].value + temp[i].unit+ temp[i].name +`<br>`
            }
          }
        prizeRecord = prizeRecord.length == 0 ? '暂未获得<br>' : prizeRecord
        moneyRecord = moneyRecord.length == 0 ? '暂未获得<br>' : moneyRecord
        Popup.alert(`<p class='long'><b>726狂欢获奖记录</b><br>`+ moneyRecord + `<b><br>解码抽奖返现记录</b><br>`+ prizeRecord , 'popup')
        return
      }
      Toast.info(data.data.message,2)
    })
  }
// 中奖名单
  // 随机返回一个奖品
  prize () {
    const prizeArr = [
      'iPhone 7一部',
      '50元现金',
      '30元现金',
      '20元现金',
      '10元现金',
      '5元现金',
      '2元现金',
      '1元现金',
      'iPhone 7一部',
      '2元现金抵扣券',
      '5元现金抵扣券',
      '10元现金抵扣券',
      '20元现金抵扣券',
      '30元现金抵扣券',
      '50元现金抵扣券',
      '100元提额券',
      '200元提额券',
      '300元提额券',
      '400元提额券',
      '500元提额券',
      'iPad Air一台',
      '10000金币',
      '80000金币',
      '60000金币',
      '50000金币',
      '30000金币',
      '20000金币',
      '10000金币',
      '5000金币',
      'iPad Air一台'

    ]
    let n = Math.floor(Math.random() * prizeArr.length + 1) - 1
    return (prizeArr[n])
  }
  // 根据字典生成随机序列
  randomCode (len, dict) {
    var rs = ''
    for (var i = 0; i < len; i++) {
      rs += dict.charAt(Math.floor(Math.random() * 100000000) % dict.length)
    }
    return rs
  }
  // 生成随机手机号码
  randomPhoneNumber () {
    // 第1位是1 第2,3位是3458 第4-7位是* 最后四位随机
    return [1, this.randomCode(2, '358'), '****', this.randomCode(4, '0123456789')].join('')
  }
  createAwardList (count) {
    var items = []
    for (var i = 0; i < count; i++) {
      var phone = this.randomPhoneNumber()
      items[i] = `恭喜 ${phone} 获得${this.prize()}`
    }
    this.awardList = items
  }
  // 暗号抽奖
  lottery () {
    statistics({
      type: 'release',
      tag: '暗号抽奖'
    })

    let signal = document.querySelector('.signal').value;
    if(signal==''){
      Toast.info('请输入暗号',2)
      return
    }
    if (!this.state.isLogin) {
      Popup.alert(`<p>您还未登录哦，请先登录</p><a class='click'>立即登录</a>`, 'popup')
      Popup.click('a.click', login,false)
      return
    }
    Toast.loading('');
    post('http://credit.xianjincard.com/activity/conference-act/get-signal-prize',{'signal':signal}).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code == 0 ) {
        let btnTxt = '立即查看',
          jump = goHome
        // 提额券或抵扣券 跳转至我的>优惠券页面
        if( data.data.type == 3){
            btnTxt = '立即使用'
            jump = goHome
        }
        // 现金红包 跳转至我的>现金红包页面
        if( data.data.type == 2){
            jump = cashBonus
        }
        // 金币 跳转至签到页
        if(data.data.type == 1){
          jump = goSignin
        }
        Popup.alert(`<p>恭喜您获得` + data.data.name +` <br/><i>`+ data.data.value +`</i>`+ data.data.unit +`</p><a class='click'>` + btnTxt + `</a>`, 'popup')
        Popup.click('a.click',jump)
        return
      }

      Popup.alert(`<p>`+ data.message + `</p><a class='click'>朕知道了</a>`, 'popup')
      Popup.click('a.click')
    }).catch(data => {
      this.errorPopup(data.message)
    })
  }

  // 直播未开始提示
  zhiboNoStart(){
      Popup.alert(`<p>直播将于7月26日13:30开始<br>敬请期待</p><a class='click'>知道了</a>`, 'popup')
      Popup.click('a.click')
  }

  browser(){
    //  callBrowser('http://pili-live-hls.multilions.com/flow-test/bbb.m3u8')
    Popup.alert(`<video className='video-1' controls='controls' poster='../assets/img/activity/release/cover2.jpg' width='100%' height='100%'>
          <source src='http://www.multilions.com/726.mp4'  type="video/mp4" />
          <p class="warning">Your browser does not support HTML5 video.</p>
        </video>`, 'popup-video')
  }

  render () {
    let {signal1, signal2, groupIngStatue,isActive,signal1Class,signal2Class} = this.state;
    let  getActiveAreaHtml = ()=>{
      let isActive = this.state.isActive;
      if(isActive){
        return (
          <div className='floor1'>
            <span className= 'ing'></span>
            <div className='group-ing'>
              <p>生活不将就 一起狂欢吧！<br/><b>7月26日全场返现</b></p>
              <button className='btn' onClick={() => this.getAward()}>点此领取</button>
            </div>
          </div>
        )
      }

      return (
        <div className='floor1' >
          <span className='timer' dangerouslySetInnerHTML={{__html: this.state.timerText}}></span>
          <div class='group-waiting'><p>神秘福利即将开始……</p></div>
        </div>
      )
    }

    let getSignalBtn1Html = ()=>{
      if(signal1 == '（完成以下任务可获暗号）'){
        return <a className='btn' onClick={() => {
          statistics({
            type: 'release',
            tag: '点此分享'
          })
          window.location.href = resolveUrl('https://h.xianjincard.com/mobile/wechat')
        }}> 点此分享</a>
      }
      return <a className='btn grey'> 点此分享</a>

    }

    let getSignalBtn2Html = ()=>{
      if(signal2 == '（完成以下任务可获暗号）'){
        return <a className='btn' onClick={() => {
          statistics({
            type: 'release',
            tag: '点此借款'
          })
          goHome()
        }}>点此借款</a>
      }
      return <a className='btn grey'> 点此借款</a>

    }
    let videoHtml = ()=>{
      let nowTime = this.getCurTime();
      if(nowTime < this.config.zhiboStartTime){
        return <img className='video-2-poster'  src='../assets/img/activity/release/cover1.jpg' onClick={() => {this.zhiboNoStart()}} width='100%' height='100%'/>
      }
      if (platform.isAndroid) {
        return <img src='../assets/img/activity/release/cover1.jpg'  width='100%' height='100%' onClick={this.browser.bind(this)} />
      }
      return (
        <video className='video-1' controls='controls' poster='../assets/img/activity/release/cover2.jpg' width='100%' height='100%'>
          <source src='http://www.multilions.com/726.mp4'  type="video/mp4" />
          <p class="warning">Your browser does not support HTML5 video.</p>
        </video>
      )
    }

    return (
      <div className='transition-group'>
        <div className='release'>
          {getActiveAreaHtml()}

          <a name="videowrapper"/>
          <button className= {groupIngStatue ? 'arrow' : 'arrow arrow-up'} onClick={() => this.slideBlock()}/>

          <div className='floor2'>
            <div className='video-wrapper'>
              {videoHtml()}
            </div>
          </div>
          <div className='floor3'>
            <h2></h2>
            <div class='meta-wrapper'><i className='icon'/>
              <div className='meta'>
                <div className='box'>
                    {this.awardList.map((item, index) => (
                      <div key={index} className='v-item'>{item}</div>
                    ))}
                </div>
              </div>
            </div>
            <div class= 'prize'></div>
            <div className='row'>
              <input type='text' placeholder='请输入暗号' className='signal'/>
              <button className='ok' onClick={() => this.lottery()}></button>
              <button className='record' onClick={() => this.record()}></button>
            </div>
            <h3>Q：如何获取抽奖暗号：</h3>
            <dl>
              <dt> 暗号1：<span className = {signal1Class}>{signal1} </span></dt>
              <dd id='ah1'>
                <span><i /><b>任务1：关注微信(xjbk88)获取解码</b></span>
                {getSignalBtn1Html()}

              </dd>
              <dt> 暗号2：<span className = {signal2Class}>{signal2} </span></dt>
              <dd id='ah2'>
                <span><i /><b>任务2：活动期间放款成功获取解码</b></span>
                 {getSignalBtn2Html()}
              </dd>
              <dt> 暗号3：<span>（完成以下任务可获暗号） </span></dt>
              <dd id='ah3'>
                <span><i /><b>任务3： 7月26日看直播获得解码信息</b></span>
                <a href='#videowrapper' className='btn' onClick = {()=>{
                  statistics({
                    type: 'release',
                    tag: '观看直播'
                  })
                }}>观看直播</a>
              </dd>
            </dl>
            <h4></h4>
            <ol>
                <li>活动时间: 7月24日 10:00-7月26日24:00;</li>
                <li>活动期间根据任务提示，完成任务可获相应暗号；</li>
                <li>在输入框中输入暗号，即可参与抽奖，壕礼等你拿；</li>
                <li>每人最多可获得3个暗号，每个暗号限抽奖一次，抽完失效；</li>
                <li>本活动最终解释权归现金卡所有。</li>
              </ol>
          </div>
        </div>
      </div>
    )
  }
}
