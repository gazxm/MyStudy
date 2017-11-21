export default new class Content {
  popupHtml (content = '服务器繁忙，请稍后重试', tips = '朕知道了') {
    return `<p>${content}</p><a class='click'>${tips}</a>`
  }

  showHtml (code) {
    switch (code) {
      case 0:
        return this.popupHtml('恭喜您<br />押注成功啦~')
      case -1001:
        return this.popupHtml('您尚未登录，请先登录哦~', '马上登录')
      case -1014:
        return this.popupHtml('您操作太快啦，请稍后再试哦~')
      case -2012:
        return this.popupHtml('亲，活动即将开始，敬请期待~')
      case -2013:
        return this.popupHtml('亲，活动已经结束<br />更多精彩马上来袭~')
      case -2017:
        return this.popupHtml('亲，需要在10-24点的时间内押注哦')
      case -2022:
        return this.popupHtml('亲，您已经押了100注了哦~')
      case -2031:
        return this.popupHtml('亲，您的剩余金币不足', '去赚金币')
      case -2032:
        return this.popupHtml('啊哦~<br />这个话题不见了~')
      case -2100:
        return this.popupHtml('亲，当前没有话题哦~')
      case -2101:
        return this.popupHtml('亲，不能押0注哦~')
      default:
        return this.popupHtml('服务器繁忙 请稍后再试')
    }
  }

  showRule (gold) {
    return `<h3>游戏规则:</h3><p>话题分为2个观点，选择你认为是少数一方的观点进行押注。押注量少一方获胜，奖励押注金币翻倍。</p><h3>押注规则:</h3><p>每注花费${gold}金币，可以多次押注，也可以同时押注两方。确认押注一概不能反悔，每一方押注上限为100注。</p><h3>活动时间:</h3><p>每天10:00-24:00，话题结束后揭晓获胜方观点，获胜方金币将在72小时内到账。</p><p>本活动最终解释权归现金卡所有，与App.Inc无关</p>`
  }

  showStake (gold, mygold = 0, type) {
    return `<h3>确认押注</h3><div>${type === 1 || type === 3 ? '<li><p class="p1"><span class="sp5">押蓝方（注）</span></p><p class="p2 clearfix"><span class="sp1 b-minus">-</span><span class="sp2 b-num">1</span><span class="sp3 b-plus">+</span></p></li>' : ''}${type === 2 || type === 3 ? '<li><p class="p1"><span class="sp6">押红方（注）</span></p><p class="p2 clearfix"><span class="sp1 r-minus">-</span><span class="sp2 r-num">1</span><span class="sp3 r-plus">+</span></p></li>' : ''}<li><p class="p1">需金币（个）</p><p class="p2 clearfix"><span class="sp4 gold">${type === 1 || type === 2 ? gold : gold * 2}</span></p></li><li><p class="p1">当前金币（个）</p><p class="p2 clearfix"><span class="sp4">${mygold}</span></p></li></div><a class='click'>果断押注</a>`
  }
}()
