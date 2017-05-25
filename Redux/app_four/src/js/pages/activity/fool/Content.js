export default new class Content {
  popupHtml (content = '<span>服务器繁忙 请稍后重试</span>') {
    return `<p class='middle'>${content}</p>`
  }

  loginHtml (content = '您尚未登录，快去登录来获得<br />您的领取借钱不用还特权！', tips = '点击登录') {
    return `<p>${content}</p><a class='click'>${tips}</a>`
  }

  errorHtml (code) {
    switch (code) {
      case -1001:
        return this.loginHtml()
      case -2012:
        return this.popupHtml('<span>主人~活动还没开始哦~</span>')
      case -2013:
        return this.popupHtml('<span>主人~活动已经结束啦~<br />请关注现金卡其他活动吧~</span>')
      default:
        return this.popupHtml()
    }
  }
}()
