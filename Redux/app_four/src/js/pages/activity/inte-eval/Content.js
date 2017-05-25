export default new class Content {
  popupHtml (content = '服务器繁忙，请稍后重试', tips = '朕知道了') {
    return `<p>${content}</p><a class='click'>${tips}</a>`
  }

  showHtml (code) {
    switch (code) {
      case -1001:
        return this.popupHtml('您还尚未登录，请先登录', '立即登录')
      default:
        return this.popupHtml()
    }
  }

  forwardHtml () {
    return this.popupHtml('鉴于您基础认证未完成<br />完善后再进行智能测评', '完成基础认证')
  }
}()
