export default new class Content {
  popupHtml (content = '服务器繁忙，请稍后重试', tips = '朕知道了', className = '') {
    return `<div class='text-content'><p class='${className}'>${content}</p><a class='click'>${tips}</a></div>`
  }

  showHtml (code, msg) {
    switch (code) {
      case -1001:
        return this.popupHtml('亲，请先登录哦')
      case -1014:
        return this.popupHtml('亲，您点击的太频繁了，<br />请耐心等待一会儿~')
      default:
        return this.popupHtml()
    }
  }
  // 刮刮乐中奖弹层
  rewardHtml (data) {
    return `<h3>恭喜您获得</h3><p class='reward'>${data.name}</p> <a class='click' href='${data.link}'>立即领取</a>`
  }
  // 显示大卡片
  showCard (imageUrl, iconUrl, tit, tips) {
    let backgroundImage = `background-image:url(${imageUrl})`
    return `<div class='card' style=${backgroundImage}><span><img src=${iconUrl} /></span><h2>${tit}</h2><p>${tips}</p></div>`
  }
  // 中奖详情
  showWinningDetail () {
    let iconUrl = '/assets/img/activity/week/card-icon.png'
    let imageUrl = '/assets/img/activity/week/card-bg1.png'
    let backgroundImage = `background-image:url(${imageUrl})`
    return `<h2>恭喜你中四等奖<br/>下期周周乐1注</h2>
            <dl class='card-list'>
              <dd class='win'>
                 <div class='card-wrapper'>
                  <a /><a /><a /><a style=${backgroundImage}><img src=${iconUrl} /><b>特权营</b></a>
                </div>
              </dd>
            </dl>
            <p>下期周周乐1注</p>
            <a href='http://h.xianjincard.com/activity/invite' class='share-btn'>分享好运气</a>`
  }
  // 规则
  showRule () {
    return `<h2>① 可以在借款成功页刮周周乐</h2><span class='img1' ></span><h2>② 每周三中午12点开奖<br/>&emsp;牌面和开奖结果一致即可中奖</h2><span class='img2'></span>`
  }
  // 视频
  showVideo () {
    return `<video className='video-1' controls='controls' poster='' width='100%' height='100%'>
          <source src='http://www.multilions.com/726.mp4'  type="video/mp4" />
          <p class="warning">Your browser does not support HTML5 video.</p>
        </video>`
  }
}()
