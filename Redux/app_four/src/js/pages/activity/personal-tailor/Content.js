export default new class Content {
  popupHtml (content = '<span>服务器繁忙 请稍后重试</span>', tips = '朕知道了') {
    return `<p>${content}</p><a class='click'>${tips}</a>`
  }

  showRule () {
    return `<h3>活动规则</h3><div class='rule-content'><p>1.活动时间：2017.05.18 10:00起</p><p>2.参与对象：平台注册用户</p><p>3.通过活动场景借款的用户会获得刮刮卡大礼包一份</p></div>`
  }

  popup (data) {
    return `<div class='all-content'><h3>${data.title}</h3><div class='popup-icon'><img src='${data.icon}' /></div><h4>你可能来对地方啦~</h4><p>${data.desc}</p><a class='click'>${data.button_text}</a><h5>${data.bottom_text}</h5></div>`
  }

  showHtml (code) {
    switch (code) {
      case -1001:
        return this.popupHtml('亲，请您先登录哦~', '立即登录')
      case -1014:
        return this.popupHtml('亲，您点击的太频繁了，<br />请耐心等待一会儿~')
      case -2001:
        return this.popupHtml('啊哦，对应的刮刮卡不见了~<br />亲，请您先选择其他的吧~')
      case -2012:
        return this.popupHtml('亲，活动即将开始<br />敬请期待~')
      case -2013:
        return this.popupHtml('亲，活动已经结束<br />更多精彩马上来袭~')
      default:
        return this.popupHtml()
    }
  }

  errorHtml () {
    return this.popupHtml()
  }
}()
