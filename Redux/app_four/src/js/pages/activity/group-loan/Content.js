export default new class Content {
  popupHtml (content = '服务器繁忙，请稍后重试', tips = '朕知道了') {
    return `<p>${content}</p><a class='click'>${tips}</a>`
  }

  showHtml (code, count, leader, isNew) {
    switch (code) {
      case 0:
        return this.popupHtml(`您已成功${leader ? '开' : '参'}团，当前团队人数<b>${count}</b>人<br />请邀请更多人和你一起享折扣~`, '马上邀请')
      case 1:
        return this.popupHtml(`${leader ? `您已成功组团，当前团队人数<b>${count}</b>人<br /><b class="bold">右上角分享</b>与更多人一起享折扣~` : `您已成功参团，当前团队人数<b>${count}</b>人<br /><b class="bold">右上角分享</b>与更多人一起享折扣~`}`, '朕知道了')
      case 2:
        if (leader) {
          return this.popupHtml(`您已成功组团，当前团队人数<b>${count}</b>人<br /><b class="bold">右上角分享</b>与更多人一起享折扣~`, '朕知道了')
        }
        return this.popupHtml(`${isNew ? `您已成功参团，当前团队人数<b>${count}</b>人<br /><b class="bold">右上角分享</b>与更多人一起享折扣~` : `您已参加过团，您的团队人数<b>${count}</b>人<br /><b class="bold">右上角分享</b>与更多人一起享折扣~`}`, '朕知道了')
      case -1001:
        return this.popupHtml('您尚未登录，请先登录哦~', '马上登录')
      case -1004:
        return this.popupHtml('啊哦，找不到这个团哦<br />请确认链接之后再来吧~')
      case -1014:
        return this.popupHtml('您操作太快啦，请稍后重试哦~')
      case -2003:
        return this.popupHtml('您尚未申请，请申请后开团~', '马上申请')
      case -2012:
        return this.popupHtml('亲，活动即将开始，敬请期待~')
      case -2013:
        return this.popupHtml('亲，活动已经结束<br />更多精彩马上来袭~')
      case -2023:
        return this.popupHtml('啊哦，找不到这个团哦<br />请再找团长索要链接之后再来吧~')
      case -2028:
        return this.popupHtml('啊哦，找不到这个团哦<br />请确认链接之后再来吧~')
      case -2030:
        return this.popupHtml('当前团队已满员了哦<br />请开团享受福利吧~')
      default:
        return this.popupHtml()
    }
  }
}()
