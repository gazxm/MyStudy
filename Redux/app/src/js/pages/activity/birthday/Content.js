export default new class Content {
  popupHtml (content = '服务器繁忙，请稍后重试', tips = '朕知道了') {
    return `<p>${content}</p><a class='click'>${tips}</a>`
  }

  showHtml (code) {
    switch (code) {
      case -1001:
        return this.popupHtml('亲，您还没有登录哦~', '马上登录')
      case -1014:
        return this.popupHtml('您操作太快啦，请稍后再试哦~')
      case -2003:
        return this.popupHtml('亲，您不符合领取资格哦~')
      case -2012:
        return this.popupHtml('亲，活动即将开始，敬请期待~')
      case -2013:
        return this.popupHtml('亲，活动已经结束<br />更多精彩马上来袭~')
      case -2025:
        return this.popupHtml('亲，您已经领取过了哦~')
      default:
        return this.popupHtml()
    }
  }
}()
