export default new class Content {
  popupHtml (content = '服务器繁忙，请稍后重试', tips = '朕知道了') {
    return `<div class='text-content'><p>${content}</p><a class='click'>${tips}</a></div>`
  }

  showHtml (code) {
    switch (code) {
      case -1001:
        return this.popupHtml('您尚未登录，请先登录哦~', '马上登录')
      case -1018:
        return this.popupHtml('亲，您暂时没有资格哦~')
      case -2012:
        return this.popupHtml('亲，活动即将开始，敬请期待~')
      case -2013:
        return this.popupHtml('亲，活动已经结束<br />更多精彩马上来袭~')
      default:
        return this.popupHtml()
    }
  }

  showRule () {
    return `<div class='rule'><h3>活动规则</h3><p>1、活动时间：6月29日10:00——7月28日24:00</p><p>2、活动对象：现金卡平台用户</p><p>3、获奖规则：在活动期间，用户邀请满10位好友注册并借款成功，即可获得2000元借款红包，红包将会分成2个1000元抵扣券发放至APP【我的】-【优惠券】中，抵扣券可在借款时抵扣本金和利息。</p><p>4、2000元抵扣券将在活动结束后3个工作日内发放至个人优惠券中，抵扣券有效期为自发放日起2个月内,仅限借款≥1000元使用，本券不与其他优惠同享</p><p>5、本活动奖励与【兼职来赚钱】活动同享，如有疑问，请关注官方微信“现金白卡（xjbk88）”咨询微信客服或致电客服电话4006812016</p><p>6、本活动最终解释权归现金卡所有，与苹果公司无关</p></div>`
  }
}()
