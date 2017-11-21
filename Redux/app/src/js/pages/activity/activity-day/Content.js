export default new class Content {
  popupHtml (content = '服务器繁忙，请稍后重试', tips = '朕知道了', className = '') {
    return `<div class='text-content'><p class='${className}'>${content}</p><a class='click ${className}'>${tips}</a></div>`
  }

  showHtml (code, type, gold, num) {
    switch (code) {
      case '0':
        return this.popupHtml('完成所有基础认证，<br />有机会成为金卡哦~', '立即认证')
      case '1':
        return this.popupHtml(`亲，请按时还款<br />您将有机会申请金卡哦~`, '立即借款')
      case '2':
        return this.popupHtml('亲，您已经是金卡用户哦~', '立即借款')
      case '3':
        return this.popupHtml('亲，您已经是分期卡用户哦~', '立即借款')
      case 0:
        if (type === 1) {
          return this.popupHtml(`<b>恭喜您！</b>获得了${gold}个金币`, '立即查看', 'middle')
        } else {
          return this.popupHtml()
        }
      case -1001:
        return this.popupHtml('您尚未登录，请先登录哦~', '马上登录')
      case -1014:
        return this.popupHtml('亲，您点击的太频繁了，<br />请耐心等待一会儿~')
      case -2012:
        return this.popupHtml('亲，活动即将开始，敬请期待~')
      case -2013:
        return this.popupHtml('亲，活动已经结束<br />更多精彩马上来袭~')
      case -2025:
        return this.popupHtml('亲，您已经参加过本活动啦~')
      case -2031:
        return this.popupHtml('哇呀，金币已经挖光了<br />正在紧急生产中~')
      case -2035:
        return this.popupHtml('亲，这一期活动即将开始，<br />敬请期待~')
      case -2036:
        return this.popupHtml('亲，这一期活动已经结束<br />更多精彩马上来袭~')
      case -2100:
        return this.popupHtml('服务器繁忙，请稍后重试', '')
      default:
        return this.popupHtml()
    }
  }

  showRule (type) {
    switch (type) {
      case 1:
        return `<h3>活动规则</h3><h4 class='h4'>一、参与资格</h4><p>平台注册用户（除分期卡申请用户）通过点击“借钱不用还”按钮进入申请，可有机会本息全免资格。</p><h4>二、本息全免资格</h4><p>活动期间申请借款用户手机尾号与周四上证收盘指数尾号后4位（含小数）匹配的用户可获得免本免息资格</p><h4>三、本息返还时间</h4><p>中奖用户按时还款后，三个工作日内将该笔免本息现金发放至个人绑定的银行卡中。</p><p class='margin'><b>四、</b>中奖名单当于活动结束后当日18:00前公布，并发送短信至中奖用户，如有疑问请关注现金白卡公众号“xjbk88"咨询。</p><p class='margin'><b>五、</b>本活动最终解释权归现金卡所有，与Apple.inc无关。</p><a class='click'>朕知道了</a>`
      case 2:
        return `<h3>活动规则</h3><h4 class='h4'>一、适用人群</h4><p>平台注册用户</p><h4>二、开抢条件</h4><p>每人每天有一次抢币机会</p><h4>三、奖励发放</h4><p>金币领用情况，请至App中【我的】金币页面查看</p><p class='margin'><b>四、</b>本活动最终解释权归现金卡所有，与Apple.inc无关</p><a class='click'>朕知道了</a>`
      case 3:
        return `<h3>活动规则</h3><div class='rule-content'><h4>一、活动时间：<b>每周一10:00——周四15:00</b></h4><h4>二、参与对象：<b>平台用户</b></h4><h4>三、如何获得“借多少返多少”资格？</h4><p>活动期间通过点击活动页【马上借钱不用还】按钮，进行申请且放款的用户，即获参与“借多少返多少”资格</p><h4>四、如何中奖？</h4><p>获得资格用户的手机号后四位，与周四上证指数收盘结果后四位相同，即可获得“借多少返多少”大奖；现金卡将于开奖日周四24点前发布获奖结果和名单，并发送获奖短信至获奖用户。</p><h4>五、返现流程</h4><p>用户按时还款后，现金卡官方将在3个工作日内将该笔借款本金和利息（除去使用券金额）打到获奖用户绑定的银行卡中。如有逾期，取消获奖资格</p><p><b>六、</b>活动期间，每位用户只有一次获奖机会，只有最终放款用户才有资格获奖</p><p><b>七、</b>如有疑问，请关注现金白卡公众号<b class='red'>（xjbk88）</b>咨询，或联系客服，客服热线：4006812016</p><p><b>八、</b>本活动最终解释权归现金卡所有，与Apple.lnc无关。</p></div>`
    }
  }

  showPast (data) {
    const table = data && data.length > 0 ? data.map((v, i) => `<tr><td>${v.name}</td><td>${v.phone}</td><td>${v.prize_data}</td></tr>`) : `<tr class='single'><td>暂无中奖名单</td></tr>`
    let str = ''
    for (let i in table) {
      str = str + table[i]
    }
    return `<h3>上期名单</h3><div class='past'><table><tr><td>获奖用户</td><td>手机号</td><td>返现金额</td></tr></table><div class='past-content'><table class='table-two'>${str}</table></div></div>`
  }
}()
