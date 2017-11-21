import React from 'react'
import { resolveUrl, partake, copy, back, goHome, goCertification, retrievePassword, goCoupon, callBrowser, navLeftButton, login, openApp, hrefNative } from 'utils'
import 'scss/api.component.scss'

export default class Api extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    navLeftButton(function () {
      alert('回退按钮')
    })
  }

  partakeClick () {
    const url = resolveUrl(`http://h.xianjincard.com/activity/invite/share?invite_code=${this.state.inviteCode}`)
    const imgUrl = 'https://res.xianjincard.com/xjk_yy/1595353ada1a8e.png'
    partake({
      'share_title': '5分钟借款5千元，首借免本息',
      'share_body': '通过这个链接注册，速度更快哦！还有机会白拿1999元现金！',
      'share_url': url,
      'share_logo': imgUrl
    })
  }

  addCal () {
    try {
      window.nativeMethod.addCalendarRemind(JSON.stringify(new Date()))
    } catch (e) {
      alert(e)
    }
  }

  device () {
    try {
      alert(window.nativeMethod.getDeviceId())
    } catch (e) {
      alert(e)
    }
  }

  tel () {
    try {
      window.nativeMethod.callPhoneMethod('110')
    } catch (e) {
      alert(e)
    }
  }

  mox () {
    try {
      window.nativeMethod.Moxiecert('1', '1', '1')
    } catch (e) {
      alert(e)
    }
  }

  email () {
    try {
      window.nativeMethod.emailcert('1', '1')
    } catch (e) {
      alert(e)
    }
  }

  unicorn () {
    try {
      window.nativeMethod.startUnicorn('1', '1', '1', '1')
    } catch (e) {
      alert(e)
    }
  }

  render () {
    return (
      <div className='api'>
        <a onClick={this.addCal.bind(this)}>添加日历提醒</a>
        <a onClick={this.email.bind(this)}>摩羯qq邮箱</a>
        <a onClick={this.mox.bind(this)}>摩羯认证</a>
        <a onClick={this.device.bind(this)}>获取deviceid</a>
        <a onClick={this.unicorn.bind(this)}>开启七鱼</a>
        <a onClick={() => copy('复制成功')}>复制按钮</a>
        <a onClick={this.tel.bind(this)}>打电话</a>
        <a onClick={this.partakeClick.bind(this)}>分享按钮</a>
        <a onClick={() => back()}>返回按钮</a>
        <a onClick={() => hrefNative(1)}>忘记密码</a>
        <a onClick={() => retrievePassword()}>忘记支付密码</a>
        <a onClick={() => goCertification()}>跳转认证</a>
        <a onClick={() => goHome()}>跳转首页</a>
        <a onClick={() => hrefNative(5)}>QQ</a>
        <a onClick={() => hrefNative(6)}>红包页面</a>
        <a onClick={() => hrefNative(7)}>H5登录完跳转首页</a>
        <a onClick={() => hrefNative(8)}>跳转借款记录</a>
        <a onClick={() => hrefNative(9)}>上传还款凭证</a>
        <a onClick={() => callBrowser('http://www.baidu.com')}>唤起浏览器</a>
        <a onClick={() => hrefNative(11)}>催收投诉</a>
        <a onClick={() => goCoupon()}>优惠券</a>
        <a onClick={() => hrefNative(14)}>展示微信右上标或者截图</a>
        <a onClick={() => hrefNative(15)}>跳转卡详情页，类型为金卡</a>
        <a onClick={() => hrefNative(16)}>跳转身份证认证页面</a>
        <a onClick={() => hrefNative(17)}>跳转紧急联系人认证页面</a>

        <a onClick={() => login()}>跳转登录</a>
        <a onClick={() => openApp()}>打开APP</a>
      </div>
    )
  }
}
