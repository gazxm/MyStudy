export default new class Content {
  popupHtml (content = '服务器繁忙，请稍后重试', tips = '朕知道了') {
    return `<p>${content}</p><a class='click'>${tips}</a>`
  }

  showRule () {
    return `<p><i></i>活动时间：2017年6月14日10点—6月30日15点</p>
            <p><i></i>活动对象：所有金卡用户</p>
            <p><i></i>如何获得借3000返3000？</p>
            <p>活动期间进行申请且放款的用户，手机号后五位与表格中标注的日期上证指数收盘价后五位（含小数点）相同，即可获得“借3000返3000”大奖；</p>
            <p>其中6月14日10点——6月16日15点为第一批；</p>
            <p>6月16日15点——6月23日15点为第二批；</p>
            <p>6月16日15点——6月23日15点为第二批；</p>
            <p><i></i>现金卡将于每个公布日18点前发布获奖结果和名单</p>
            <p><i></i>返现流程</p>
            <p class="public">现金卡官方将于中奖当日18：00前奖中奖名单公布在活动页面，并发送获奖短信至获奖用户，用户在还款期内全额还款，确认还款后，现金卡官方将在3个工作日内将该笔借款本金和利息（除去使用券金额）打到获奖用户绑定的银行卡中。如有逾期，取消获奖资格</p>
            <p><i></i>活动期间，每位用户只有一次获奖机会，只有最终放款用户才有资格获奖</p>
            <div class="line"></div>`
  }

  showHtml (code) {
    switch (code) {
      case -1001:
        return this.popupHtml('您尚未登录，请先登录哦~', '马上登录')
      case -2003:
        return this.popupHtml('完善认证就有机会领金卡哦！', '立即完善')
      case -2012:
        return this.popupHtml('亲，活动即将开始，敬请期待~')
      case -2013:
        return this.popupHtml('亲，活动已经结束<br />更多精彩马上来袭~')
      default:
        return this.popupHtml()
    }
  }
}()
