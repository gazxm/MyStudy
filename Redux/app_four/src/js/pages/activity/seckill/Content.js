export default new class Content {
  popupHtml (content = '服务器繁忙，请稍后重试', tips = '朕知道了') {
    return `<p>${content}</p><a class='click'>${tips}</a>`
  }

  showHtml (code, type, amount, name, expire, unit) {
    switch (code) {
      case 0:
        if (type === '1') {
          return this.popupHtml(`恭喜您领取一${unit}${amount}${name}，<br />有效期${expire}，记得使用哦~`, '马上使用')
        } else if (type === '2') {
          return this.popupHtml(`恭喜您领取${amount}${name}，<br />记得使用哦~`)
        } else {
          return this.popupHtml(`恭喜您领取${amount}${name}，<br />记得去返现哦~`)
        }
      case -1001:
        return this.popupHtml('您尚未登录，请先登录哦~', '马上登录')
      case -1014:
        return this.popupHtml('亲，您点击的太频繁了，<br />请耐心等待一会儿~')
      case -2012:
        return this.popupHtml('亲，活动即将开始，敬请期待~')
      case -2013:
        return this.popupHtml('亲，活动已经结束<br />更多精彩马上来袭~')
      case -2024:
        return this.popupHtml('好遗憾，您与本次秒杀擦肩而过<br />下个时段惊喜更大哦~')
      case -2025:
        if (type === '1') {
          return this.popupHtml(`恭喜您已领取过一${unit}${amount}${name}，<br />有效期${expire}，记得使用哦~`, '马上使用')
        } else if (type === '2') {
          return this.popupHtml(`恭喜您已领取过${amount}${name}，<br />记得使用哦~`)
        } else {
          return this.popupHtml(`恭喜您已领取过${amount}${name}，<br />记得去返现哦~`)
        }
      case -2029:
        return this.popupHtml('亲，该奖励已经不能领取了哦~')
      default:
        return this.popupHtml()
    }
  }
}()
