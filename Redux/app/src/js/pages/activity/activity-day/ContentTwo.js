export default new class Content {
  popupHtml (content = '服务器繁忙，请稍后重试', tips = '朕知道了', className = '') {
    return `<div class='text-content'><p class='${className}'>${content}</p><a class='click'>${tips}</a></div>`
  }

  showHtml (code, msg) {
    switch (code) {
      case 0:
        return this.popupHtml(`<b>恭喜您</b>领取${msg}，<br />记得使用哦~`, '立即查看', 'middle')
      case -1001:
        return this.popupHtml('您尚未登录，请先登录哦~', '马上登录')
      case -1014:
        return this.popupHtml('亲，您点击的太频繁了，<br />请耐心等待一会儿~')
      case -2003:
        return this.popupHtml('亲，您不满足活动资格哦~<br />快去借款吧~', '立即借款')
      case -2012:
        return this.popupHtml('亲，活动即将开始，敬请期待~')
      case -2013:
        return this.popupHtml('亲，活动已经结束<br />更多精彩马上来袭~')
      case -2024:
        return this.popupHtml('好遗憾，本次秒杀结束了哦<br />下个时段惊喜更大哦~')
      case -2025:
        return this.popupHtml(`<b>您已参加过</b>已领取${msg}，<br />记得使用哦~`, '立即查看', 'middle')
      case -2029:
        return this.popupHtml('亲，该奖励已经不能领取了哦~')
      case -2035:
        return this.popupHtml('亲，这一期活动即将开始，<br />敬请期待~')
      case -2036:
        return this.popupHtml('亲，这一期活动已经结束<br />更多精彩马上来袭~')
      default:
        return this.popupHtml()
    }
  }
}()
