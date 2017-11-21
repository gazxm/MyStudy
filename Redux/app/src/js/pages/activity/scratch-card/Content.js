export default new class Content {
  popupHtml (content = '服务器繁忙，请稍后重试', tips = '朕知道啦') {
    return `<p><span>${content}</span></p><a class='click'>${tips}</a>`
  }

  showHtml (code) {
    switch (code) {
      case 0:
        return this.popupHtml('亲，您兑换成功啦<br />快去刮卡吧~')
      case -1001:
        return this.popupHtml('您尚未登录，请先登录哦~', '马上登录')
      case -1014:
        return this.popupHtml('亲，您点击的太频繁了，<br />请耐心等待一会儿~')
      case -2012:
        return this.popupHtml('亲，活动即将开始<br />敬请期待~')
      case -2013:
        return this.popupHtml('亲，活动已经结束<br />更多精彩马上来袭~')
      case -2022:
        return this.popupHtml('亲，你的机会不足了哦<br />快去借款吧~', '立即借款')
      case -2024:
        return this.popupHtml('啊哦，本阶段奖品刮完了<br />请耐心等候哦~', '重置刮刮卡')
      case -2031:
        return this.popupHtml('亲，您的金币不足哦<br />点击下方按钮去赚金币吧~', '立即赚取')
      default:
        return this.popupHtml()
    }
  }

  exgold (gold) {
    return `<p><span>消耗${gold}金币就可以<br />再抽一次哦，兑吗？</span></p><div class='a-div clearfix'><a class='ok'>是的</a><a class='wait'>稍等</a></div>`
  }

  ruleHtml (exchangeGold) {
    return `<h3>活动说明</h3><p>活动时间：2017.05.27日10:00起<br />参与对象：平台注册会员<br />活动规则:<br />1.如何获得刮奖机会<br />1）每天首次登陆会免费获得1次刮奖机会；<br />2）成功借款可免费获取1次刮奖机会；<br />3）消耗${exchangeGold}金币可兑换<br />2.如何兑奖？<br />1）点击【立即领取】，进入商品页面；<br />2） 加入购物车—进入购物车，指定区域输入券码（兑换码），点击下方【使用】；<br />3）点击登录--价格变成兑换价后点击【立即结算】；<br />4）提交订单---结算---等待收货；<br />5）微信关注：恋之钻珠宝服务，咨询领取。</p><h4>本活动最终解释权归现金卡所有<br />与Apple.inc无关</h4>`
  }

  rewardHtml (data, platform) {
    return `<h3>恭喜您获得</h3><p class='reward'>${data.name}</p>${data.prize_sn !== '' ? `<div class='code clearfix'><p>兑换码：<b>${data.prize_sn}</b></p>${platform ? `<a class='copy'>复制</a>` : ''}</div>` : ``}<a class='click' href='${data.link}'>立即领取</a>`
  }

  myReward (data, platform) {
    const li = data.length > 0 ? data.map((v, i) => `<li class='clearfix'>
      <div class='left'>
        <h3>${v.name}</h3>
        <h4>有效期: 即日起至${v.expire_e}</h4>
        ${v.prize_sn !== '' ? `<p class='clearfix'><span>兑奖码: <b>${v.prize_sn}</b></span>${platform ? `<a class='copy copy-${i}'>复制</a>` : ''}</p>` : ''}
      </div>
      <a class='right' href='${v.link}'>立即领取</a>
    </li>`).join('') : `<li class='no-reward'><p>暂时没有获得奖品哦~</p></li>`

    return `<i></i><div class='reward-content'>
        <ul>
          ${li}
        </ul>
      </div>`
  }
}()
