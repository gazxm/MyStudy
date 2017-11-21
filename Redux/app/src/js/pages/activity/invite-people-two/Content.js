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
    return `<div class='rule'><h3>活动规则</h3><p>1、活动时间：8月11日10点——9月10日24点</p><p>2、活动对象：现金卡平台用户</p><p>3、获奖规则：在活动期间，用户邀请满10位好友借款成功，即可获得1999元现金。</p><p>4、领奖规则：活动结束24小时内发放短信至达标用户手机，三个工作日内，1999元现金发放至app内【我的】-【现金红包】中，可直接提现。</p><p>5、如有疑问，请关注官方微信“<b class="wechat">现金白卡（xjbk88）</b>”咨询微信客服或致电客服电话4006812016</p><p>6、本活动最终解释权归现金卡所有，与苹果公司无关</p></div>`
  }
}()
