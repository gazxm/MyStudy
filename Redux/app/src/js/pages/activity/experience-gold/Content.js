export default new class Content {
  popupHtml (content = '服务器繁忙，请稍后重试', tips = '朕知道了') {
    return `<p>${content}</p><a class='click'>${tips}</a>`
  }

  loginHtml () {
    return this.popupHtml('主人，您还没有登录哦~', '点击登录')
  }

  errorHtml (code) {
    switch (code) {
      case 0:
        return this.popupHtml('主人，金卡领取成功啦~', '使用体验金卡')
      case -1001:
        return this.loginHtml()
      case -2003:
        return this.popupHtml('您没有资格参加这个活动哦~<br />请关注现金卡其他活动吧', '回到首页')
      case -2004:
        return this.popupHtml('您没有资格参加这个活动哦~<br />请关注现金卡其他活动吧', '朕知道了')
      case -2012:
        return this.popupHtml('主人，活动还没开始哦！')
      case -2013:
        return this.popupHtml('主人~活动已经结束啦~<br />请关注现金卡其他活动吧~')
      case -2025:
        return this.popupHtml('主人，您已经领取过了哦~', '使用体验金卡')
      default:
        return this.popupHtml()
    }
  }
}()
