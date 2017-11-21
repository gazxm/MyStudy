export default new class Content {
  popupHtml (content = '服务器繁忙，请稍后重试', tips = '朕知道啦') {
    return `<p><span>${content}</span></p><a class='click'>${tips}</a>`
  }

  showHtml (code) {
    switch (code) {
      case -1001:
        return this.popupHtml('您尚未登录，请先登录哦~', '马上登录')
      case -1014:
        return this.popupHtml('亲，您点击的太频繁了，<br />请耐心等待一会儿~')
      case -2012:
        return this.popupHtml('亲，活动即将开始<br />敬请期待~')
      case -2013:
        return this.popupHtml('亲，活动已经结束<br />更多精彩马上来袭~')
      case -2033:
        return this.popupHtml('亲，评论太长了哦~')
      case -2034:
        return this.popupHtml('亲，这条评论消失在异空间啦~')
      default:
        return this.popupHtml()
    }
  }

  showDetail () {
    return `<p>说出你的花法，就有机会领取6180元现金！</p>
            <p>活动规则</p>
            <p>1.活动时间：6月20日 10:00-6月27日 24:00；</p>
            <p>2.馅饼砸头奖：评委将综合考量点赞数和答题 质量选拔出3位，每人奖励6180元现金；</p>
            <p>3.赚钱之道奖：参与答题用户通过“赚钱之道”入口进行成功借款，根据借款时间排序前30名，每人发放1000金币；</p>
            <p>4.重在参与奖：所有参与答题用户，均可获得20金币；</p>
            <p>5.同一参与用户不可重复计奖（个人注册手机号为唯一兑奖凭证）；</p>
            <p>6.中奖名单及领奖规则将于6月29日在 <i class="service">现金卡服务号</i>（微信公众号xjbk88),请及时关注。</p>
            <p>7.本活动最终解释权归现金卡 所有，与Apple.inc无关。</p>
           `
  }
  showPop () {
    return '<p>是真的6180元喔！<br/>活动结束后公布获奖名单，电话通知领奖。<br/>详情请查看“活动说明”</p><a class="click"></a>'
  }

  showTalk () {
    return `<textarea placeholder='6180块是挥霍呢，挥霍呢，还是挥霍呢，最多可挥霍200字' maxlength='200'></textarea><a class="sumbit"></a><p>我们不开玩笑<br/>只要你的脑洞够大，人缘够好<br/>就有机会 赢得6180大奖！</p>`
  }
}()
