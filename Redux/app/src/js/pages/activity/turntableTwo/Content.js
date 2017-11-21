export default new class Content {
  popupHtml (content = `<p class='middle'><span>服务器繁忙 请稍后重试</span></p>`) {
    return `<div>${content}</div>`
  }

  noChanceHtml (type) {
    if (type) {
      return `<div><p>亲，您的抽奖机会已用完，<br />邀请好友注册可以继续抽哦！</p></div><a class='click'>点击右上角邀请</a>`
    }
    return `<div><p>亲，您的抽奖机会已用完，<br />邀请好友注册可以继续抽哦！</p></div><a class='click'>点击邀请</a>`
  }

  rewardHtml (content = `<p>亲，您还没有抽奖哦！</p>`) {
    return `<h3>我的奖品</h3><div class='reward'>${content}</div>`
  }

  loginHtml (content = '2') {
    if (content === '1') {
      return `<div><h3>啊哦~</h3><p>亲，请登录后抽奖哦！</p><a class='login'>立即登录</a></div>`
    }
    if (content === '3') {
      return `<div><h3>啊哦~</h3><p>亲，请登录后兑换哦！</p><a class='login'>立即登录</a></div>`
    }
    return `<div><h3>我的奖品</h3><p>亲，请登录后查看哦！</p><a class='login'>立即登录</a></div>`
  }

  goldHtml (gold, goldConsume) {
    return `<div><p>亲，您当前拥有<b>${gold}</b>金币<br />需要消耗<b>${goldConsume}</b>枚金币兑换哦~</p></div><a class='click'>立即兑换</a>`
  }

  errorHtml (code, gold) {
    if (code === -1014) {
      return this.popupHtml(`<p class='middle'><span>亲，操作太快了，慢一点哦！</span></p>`)
    }
    if (code === -2012) {
      return this.popupHtml(`<p class='middle'><span>亲，活动尚未开始，请等一等！</span></p>`)
    }
    if (code === -2013) {
      return this.popupHtml(`<p class='middle'><span>亲，好遗憾，活动已经结束了<br/>消息中心更多有趣活动等你哦！</span></p>`)
    }
    if (code === -2031) {
      return `<div><p>亲，您的金币剩余<b>${gold}</b>个<br />余额不足哦，快去赚取金币吧~</p></div><a class='click'>赚金币</a>`
    }
    return this.popupHtml()
  }
}()
