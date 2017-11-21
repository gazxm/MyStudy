export default new class Content {
  popupHtml (content = '服务器繁忙 请稍后重试', tips = '朕知道了') {
    return `<p>${content}</p><a class='click'>${tips}</a>`
  }

  ticketNodata (type) {
    if (type === -2007) {
      return `<div><h3>啊哦~</h3><p>这个红包不见啦，<br />请留意下一次分享吧~</p></div>`
    }
    if (type === -2008) {
      return `<div><h3>手太慢了~</h3><p>本次红包已经过期咯，<br />请留意下一次分享吧~</p></div>`
    }
    if (type === -2009) {
      return `<div><h3>手太慢了~</h3><p>本次红包已经抢完咯，<br />请留意下一次分享吧~</p></div>`
    }
    if (type === -2011) {
      return `<div><h3>手太快了~</h3><p>小主请您慢点，<br />红包君承受不来啦~</p></div>`
    }
    if (type === -2012) {
      return `<div><h3>不好意思~</h3><p>本次活动未开始，<br />请耐心等候哦~</p></div>`
    }
    if (type === -2013) {
      return `<div><h3>手太慢了~</h3><p>本次活动已经结束啦，<br />请关注平台其他活动吧~</p></div>`
    }
    if (type === -2014) {
      return `<div><h3>今天领太多啦~</h3><p>每天只能抢3个红包哦！<br />明天再来抢红包吧~</p></div>`
    }
    return `<div><h3>系统繁忙！</h3><p>程序君正在努力，<br />请耐心等候哦~</p></div>`
  }
}()
