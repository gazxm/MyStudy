import React, {Component} from 'react'
import {Toast, Modal, Picker, InputItem, WingBlank, WhiteSpace, List, Flex, Button, Switch} from 'antd-mobile'
import {createForm} from 'rc-form'
// import qc from 'common/qiancheng'
import request from 'common/request'
import {navLeftButton, redirect, resolveUrl, qc, back} from 'utils'
import './index.component.scss'

const Item = List.Item
const schemeConfig = [{
  label: '首页',
  value: 'koudaikj://app.launch/main'
}, {
  label: '登录',
  value: 'koudaikj://app.launch/login/applogin'
}, {
  label: '忘记密码',
  value: 'koudaikj://app.launch/login/forgetpwd?phone=13511199035'
}, {
  label: '忘记支付密码',
  value: 'koudaikj://app.launch/me/forgetpaypwd'
}, {
  label: '认证主页',
  value: 'koudaikj://app.launch/auth'
}, {
  label: '我的',
  value: 'koudaikj://app.launch/me'
}, {
  label: '发现',
  value: 'koudaikj://app.launch/find'
}, {
  label: '借款记录',
  value: 'koudaikj://app.launch/me/loan_list'
}, {
  label: '借款记录 - 白卡金卡',
  value: 'koudaikj://app.launch/me/loan_list?type=1'
}, {
  label: '借款记录 - 分期卡',
  value: 'koudaikj://app.launch/me/loan_list?type=2'
}, {
  label: '优惠券',
  value: resolveUrl('http://h.xianjincard.com/mobile/coupon')
}, {
  label: '卡详情 - 白卡',
  value: 'koudaikj://app.launch/main/card?type=1'
}, {
  label: '卡详情 - 金卡',
  value: 'koudaikj://app.launch/main/card?type=2'
}, {
  label: '卡详情 - 分期卡',
  value: 'koudaikj://app.launch/main/card?type=3'
}, {
  label: '身份证认证',
  value: 'koudaikj://app.launch/auth/profile'
}, {
  label: '紧急联系人',
  value: 'koudaikj://app.launch/auth/emergency_contact'
}, {
  label: 'notfound',
  value: 'koudaikj://app.launch/notfound'
}]

class index extends Component {
  state = {
    timestamp: new Date().getTime(),
    jumpUrl: 'koudaikj://app.launch/reactnative?url=xianjin360%3A%2F%2Fapp%2Fproduct%3Fproductid%3D1%26title%3D%E7%BB%99%E4%BD%A0%E8%8A%B1%26brief%3D%E6%88%91%E6%98%AF%E7%AE%80%E4%BB%8B',
    openid: 'cd25c20a83c27e172c88bf60179450b7'
  }
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    document.title = 'QCJSAPI'
  }
  componentWillMount () {
  }
  middleware(response){
    let {message} = response
    Toast.fail(message)
  }
  updateCalendarRemind(){
    this.setState({
      timestamp: new Date().getTime()
    })
  }
  addCalendarRemind(){
    let {timestamp} = this.state
    qc.track('addCalendarRemind', {
      date: [{time: timestamp}]
    }).then(response => {
      alert(JSON.stringify(response))
    }).catch(this.middleware)
  }
  getDeviceId(){
    qc.track('getDeviceId').then(response => {
      Modal.alert(JSON.stringify(response))
    }).catch(this.middleware)
  }
  registerCallBack(){
    // navLeftButton(function(){
    //   alert('registerCallBack')
    //   back()
    // })
    qc.track('registerCallBack', {
      callback(){
        alert('registerCallBack')
        // setTimeout(() => qc.track('popWindow'))
      }
    }).then(response => {
      Modal.alert(JSON.stringify(response))
    }).catch(this.middleware)
  }
  copy(){
    let {getFieldsValue} = this.props.form
    let {copyText} = getFieldsValue()
    qc.track('copyTextMethod', {
      text: copyText,
      tip: '复制成功'
    }).then(response => {
      Modal.alert(JSON.stringify(response))
    }).catch(this.middleware)
  }
  destroy(){
    qc.track('popWindow').then(response => {
      Modal.alert(JSON.stringify(response))
    }).catch(this.middleware)
  }
  captureScreen(){
    qc.track('captureScreen').then(response => {
      Modal.alert(JSON.stringify(response))
    }).catch(this.middleware)
  }
  share(type){
    qc.track('shareMethod', {
      type: 0,
      share_type: 0,
      platform: type,
      share_title: 'QCJSAPI',
      share_body: '框架提供丰富的原生API，可以方便的调起应用提供的能力',
      share_url: 'http://h.xianjincard.com'
    }).then(response => {
      Modal.alert(JSON.stringify(response))
    }).catch(this.middleware)
  }
  jump(){
    let {getFieldsValue} = this.props.form
    let {jumpUrl, isLogin, browser} = getFieldsValue()
    qc.track('jump', {
      url: jumpUrl,
      need_login: isLogin,
      is_browser: browser
    }).then(response => {
      Modal.alert(JSON.stringify(response))
    }).catch(this.middleware)
  }
  startUnicorn(){
    qc.track('startUnicorn', {
      uid: 1,
      realName: 'CL',
      userName: 'CL',
      origin: 'xianjincard'
    }).then(response => {
      Modal.alert(JSON.stringify(response))
    }).catch(this.middleware)
  }
  getSessionID(){
    qc.track('getSessionID').then(response => {
      Modal.alert(JSON.stringify(response))
    }).catch(this.middleware)
  }
  setRightNavButton(options = {}){
    qc.track('setRightNavButton', {
      ...options,
      callback(response){
        alert('setRightNavButton')
        Modal.alert(JSON.stringify(response))
      }
    }).then(response => {
      Modal.alert(JSON.stringify(response))
    }).catch(this.middleware)
  }
  requestAPI(){
    request('credit-check/check').then(response => {
      Modal.alert(JSON.stringify(response))
    })
  }
  logout(){
    request('credit-user/logout').then(response => {
      Modal.alert(JSON.stringify(response))
    })
  }
  moxie(){
    let {getFieldsValue} = this.props.form
    let {moxieType} = getFieldsValue()
    let {openid} = this.state
    if(!moxieType){
      Toast.fail('请选择类型')
      return
    }
    let options = {
      openid,
      tasktype: moxieType.join(''),
      type: ''
    }
    options.tasktype == 'email' && (options.type = 'qq.com')
    qc.track('Moxiecert', options).then(response => {
      Modal.alert(JSON.stringify(response))
    }).catch(this.middleware)
  }
  getOpenID(){
    let {getFieldsValue} = this.props.form
    let {moxieType} = getFieldsValue()
    if(!moxieType){
      Toast.fail('请选择类型')
      return
    }
    Toast.loading(undefined, 0)
    request('credit-info/get-open-id', {
      params: {
        fun_name: moxieType.join('')
      }
    }).then(response => {
      let {open_id} = response.data
      if(open_id){
        window.nativeMethod && window.nativeMethod.Moxiecert(open_id, target, '')
        Toast.hide()
      }else{
        Toast.fail('系统繁忙，请稍后重试');
      }
    })
  }
  notfund(){
    qc.track('notfund').then(response => {
      Modal.alert(JSON.stringify(response))
    }).catch(this.middleware)
  }
  render () {
    let {getFieldProps, getFieldValue} = this.props.form
    let {timestamp, jumpUrl, jumpAction, openid} = this.state
    let isJump = getFieldValue('isJump')
    let scheme = (data, index) => {
      let {label, value} = data
      let click = () => {
        qc.track('jump', {
          url: value
        }).then(response => {
          Modal.alert(JSON.stringify(response))
        }).catch(this.middleware)
      }
      return (
        <Button key={index} size='small' onClick={click} inline>{label}</Button>
      )
    }
    return (
      <div className='wrapper-misc-api' style={{
        minHeight: document.documentElement.clientHeight
      }}>
        <List renderHeader={() => 'URLScheme'}>
          <Flex wrap='wrap' className='url-scheme'>
            {schemeConfig.map(scheme)}
              <Button size='small' onClick={() => redirect.push('/misc/quick-login')} inline>快速登录</Button>
            <Button size='small' onClick={() => window.location.href = 'tel:15105550101'} inline>tel</Button>
            <Button size='small' onClick={() => window.location.href = 'mailto:liukunliang@xianjincard.com'} inline>mailto</Button>
            <Button size='small' onClick={() => window.location.href = 'sms:15105550101;15105550102'} inline>sms</Button>
            <Button size='small' onClick={() => redirect.push('/mobile/repayment/result/896719155')} inline>结果页</Button>
            <Button size='small' onClick={() => redirect.push('/activity/invite')} inline>活动</Button>
          </Flex>
        </List>
        <List renderHeader={() => <div>日历提醒 <small>addCalendarRemind</small></div>}>
          <InputItem value={timestamp}>时间戳</InputItem>
          <Item>
            <Flex justify='between'>
              <Button type='primary' size='small' inline onClick={this.addCalendarRemind.bind(this)}>添加</Button>
              <Button size='small' inline onClick={this.updateCalendarRemind.bind(this)}>更新时间</Button>
            </Flex>
          </Item>
        </List>
        <List renderHeader={() => <div>获取设备信息 <small>getDeviceId</small></div>}>
          <Item>
            <Button type='primary' size='small' inline onClick={this.getDeviceId.bind(this)}>获取</Button>
          </Item>
        </List>
        <List renderHeader={() => <div>注册返回事件 <small>registerCallBack</small></div>}>
          <Item>
            <Button type='primary' size='small' inline onClick={this.registerCallBack.bind(this)}>返回</Button>
          </Item>
        </List>
        <List renderHeader={() => <div>拷贝 <small>copyTextMethod</small></div>}>
          <InputItem {...getFieldProps('copyText', {
            initialValue: 'xianjincard'
          })}/>
          <Item>
            <Button type='primary' size='small' inline onClick={this.copy.bind(this)}>拷贝</Button>
          </Item>
        </List>
        <List renderHeader={() => <div>销毁WebView <small>popWindow</small></div>}>
          <Item>
            <Button type='primary' size='small' inline onClick={this.destroy.bind(this)}>销毁</Button>
          </Item>
        </List>
        <List renderHeader={() => <div>截屏 <small>captureScreen</small></div>}>
          <Item>
            <Button type='primary' size='small' inline onClick={this.captureScreen.bind(this)}>截屏</Button>
          </Item>
        </List>
        <List renderHeader={() => <div>分享 <small>shareMethod</small></div>}>
          <Item>
            <Flex justify='between'>
              <Button size='small' inline onClick={this.share.bind(this, 'WEIXIN')}>分享到微信</Button>
              <Button size='small' inline onClick={this.share.bind(this, 'WEIXIN_CIRCLE')}>分享到朋友圈</Button>
              <Button size='small' inline onClick={this.share.bind(this, 'SINA')}>分享到微博</Button>
            </Flex>
          </Item>
        </List>
        <List renderHeader={() => <div>跳转 <small>jump</small></div>}>
          <InputItem {...getFieldProps('jumpUrl', {
            initialValue: jumpUrl,
          })}>跳转地址</InputItem>
          <Item extra={<Switch {...getFieldProps('isLogin', {
              initialValue: true,
              valuePropName: 'checked'
            })}
          />}>是否需要登录</Item>
          <Item extra={<Switch {...getFieldProps('browser', {
              initialValue: false,
              valuePropName: 'checked'
            })}
          />}>外部浏览器打开</Item>
          <Item>
            <Button type='primary' size='small' inline onClick={this.jump.bind(this)}>跳转</Button>
          </Item>
        </List>
        <List renderHeader={() => <div>七鱼客服 <small>startUnicorn</small></div>}>
          <Item>
            <Button type='primary' size='small' inline onClick={this.startUnicorn.bind(this)}>开始</Button>
          </Item>
        </List>
        <List renderHeader={() => <div>获取SESSIONID <small>getSessionID</small></div>}>
          <Item>
            <Flex justify='between'>
              <Button type='primary' size='small' inline onClick={this.getSessionID.bind(this)}>获取</Button>
              <Button type='primary' size='small' inline onClick={this.requestAPI.bind(this)}>请求接口</Button>
              <Button size='small' inline onClick={this.logout.bind(this)}>退出登录</Button>
            </Flex>
          </Item>
        </List>
        <List renderHeader={() => <div>设置右侧导航按钮 <small>setRightNavButton</small></div>}>
          <Item>
            <Flex justify='between'>
              <Button size='small' inline onClick={this.setRightNavButton.bind(this, {text: '按钮'})}>设置文字</Button>
              <Button size='small' inline onClick={this.setRightNavButton.bind(this, {icon: 'http://res.xianjincard.com/xjk_yy/4591bf1a709b39.png'})}>设置图标</Button>
            </Flex>
          </Item>
        </List>
        <List renderHeader={() => <div>魔蝎SDK <small>Moxiecert</small></div>}>
          <InputItem value={openid}>tokenid</InputItem>
          <Picker cols={1} data={[{
            label: '淘宝认证',
            value: 'taobao'
          }, {
            label: '支付宝认证',
            value: 'alipay'
          }, {
            label: '京东认证',
            value: 'jingdong'
          }, {
            label: 'QQ邮箱',
            value: 'email'
          }]} {...getFieldProps('moxieType')}>
            <Item>type</Item>
          </Picker>
          <Item>
            <Flex justify='between'>
              <Button type='primary' size='small' inline onClick={this.moxie.bind(this)}>启动</Button>
              {
                // <Button type='ghost' size='small' inline onClick={this.getOpenID.bind(this)}>获取OPENID</Button>
              }
            </Flex>
          </Item>
        </List>
        <List renderHeader={() => <div>不支持该方法 <small>notfund</small></div>}>
          <Item>
            <Flex justify='between'>
              <Button size='small' inline onClick={this.notfund.bind(this)}>确认</Button>
            </Flex>
          </Item>
        </List>
      </div>
    )
  }
};

export default createForm()(index)