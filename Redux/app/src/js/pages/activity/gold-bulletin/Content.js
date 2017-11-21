export default new class Content {
  popupHtml (content = '服务器繁忙，请稍后重试', tips = '朕知道了') {
    return `<p>${content}</p><a class='click'>${tips}</a>`
  }

  showHtml (code) {
    switch (code) {
      case '1':
        return this.popupHtml('亲，您已经是白卡用户 <br />按时还款有机会成为金卡哦~', '立即借款 ')
      case '2':
        return this.popupHtml('亲，您已是金卡用户哦~', '立即借款 ')
      case '3':
        return this.popupHtml('亲，您已是分期卡用户~', '立即借款 ')
      case -1001:
        return this.popupHtml('您尚未登录，请先登录哦~', '马上登录')
      case -2012:
        return this.popupHtml('亲，活动即将开始，敬请期待~')
      case -2013:
        return this.popupHtml('亲，活动已经结束<br />更多精彩马上来袭~')
      case -2100:
        return this.popupHtml('亲，请先认证哦~', '立即认证')
      default:
        return this.popupHtml()
    }
  }
}()
