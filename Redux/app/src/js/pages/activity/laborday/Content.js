export default new class Content {
  popupHtml (content = '服务器繁忙，请稍后重试', tips = '朕知道啦') {
    return `<p><span>${content}</span></p><a class='click'>${tips}</a>`
  }

  showHtml (code) {
    switch (code) {
      case 0:
        return this.popupHtml('马上申请即有机会<br />获得免本息资格', '马上借款')
      case -1001:
        return this.popupHtml('您尚未登录，请先登录哦~', '马上登录')
      case -1014:
        return this.popupHtml('亲，您点击的太频繁了，<br />请耐心等待一会儿~')
      case -2012:
        return this.popupHtml('亲，活动即将开始<br />敬请期待~')
      case -2013:
        return this.popupHtml('亲，活动已经结束<br />更多精彩马上来袭~')
      default:
        return this.popupHtml()
    }
  }
}()
