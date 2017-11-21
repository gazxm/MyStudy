export default new class Content {
  popupHtml (content = '服务器繁忙，请稍后重试', tips = '朕知道了', title = '', bottom = '') {
    return `<div class='text'><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><h3>${title}</h3><p><span>${content}</span></p><a class='click'>${tips}</a><h4>${bottom}</h4></div>`
  }

  goldHtml (content, button1, button2, bottom) {
    return `<div class='text'><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><h3>我的优选</h3><p><span>${content}</span></p><a class='one-click'>${button1}</a><a class='two-click'>${button2}</a><h4>${bottom}</h4></div>`
  }

  showHtml (code, type, times) {
    switch (code) {
      case '-1':
        return this.popupHtml('啊哦~<br />您暂时未兑换宝贝噢~', '去看看其它宝贝', '我的优选')
      case '0':
        return this.popupHtml(`您已获得兑换${type}<br />的资格，请在5分钟内兑换`, '使用金币兑换', '我的优选')
      case '1':
        return this.popupHtml(`恭喜您获得${type}，<br />请填写收货信息~`, '填写收货信息', '我的优选')
      case '2':
        return this.popupHtml(`恭喜您获得${type}`, '朕知道了', '我的优选')
      case -1001:
        return this.popupHtml(`${type === 'choose' ? '您与宝贝自己还差一个登录<br />请先登录哦~' : '您尚未登录，请先登录哦~'}`, '马上登录')
      case -1004:
        return this.popupHtml('亲，你提交的参数好像有点不对哦，<br />再核对一下吧~')
      case -1014:
        return this.popupHtml('亲，慢一点哦，提交太频繁啦~')
      case -2000:
        return this.popupHtml('哎哟~<br />您和宝贝错过了~', '去看看其它宝贝', '我的优选')
      case -2001:
        if (type === 'tv') {
          return this.popupHtml('啊哦~这个视频不见啦<br />无法点赞哦~')
        }
        return this.popupHtml('啊哦~这个商品不见啦', '去看看其它宝贝', '我的优选')
      case -2003:
        return this.popupHtml(`哎呀，当前可用还款次数${times}次<br />您的可用还款次数不足哦~`, '去看看其它宝贝', '我的优选')
      case -2012:
        return this.popupHtml('亲，活动即将开始，敬请期待~')
      case -2013:
        return this.popupHtml('亲，金粉关怀日<br />每月20号等你哦~')
      case -2014:
        return this.popupHtml('亲，您已经兑换过啦~', '我的优选')
      case -2024:
        return this.popupHtml('亲，该商品已经兑换完啦~', '去看看其它宝贝', '我的优选')
      case -2025:
        return this.popupHtml('您的心愿已被放到许愿池啦<br />请等待~')
      case -2031:
        return this.goldHtml('金币不足，快去赚金币！<br />（5分钟内有效）', '去看看其它', '赚金币', `您当前共有<b>${type}个金币</b>`)
      case -2033:
        return this.popupHtml('亲，您的评论太长啦~')
      case -2035:
        return this.popupHtml('亲，本场活动还未开始哦~')
      case -2037:
        return this.popupHtml('不好意思~<br />您有过逾期超过1个月记录<br />不能参与金粉惠选！', '朕知道了', '我的优选')
      case -2038:
        return this.popupHtml('您已获得兑换宝贝的资格<br />请在5分钟内兑换', '使用金币兑换', '我的优选', `${type === 'shop' ? `您当前共有<b>${times}个金币</b>` : ''}`)
      case -2039:
        return this.popupHtml('您已经超过5分钟，兑换<br />资格已经失效咯~', '去看看其它宝贝', '我的优选')
      case -2040:
        return this.popupHtml('啊哦~<br />您已经提交过地址啦~')
      case -2101:
        return this.popupHtml('啊哦~<br />该商品已经下架了哦~', '去看看其它宝贝', '我的优选')
      case -2104:
        return this.popupHtml('啊哦~<br />该商品已经卖完了哦~', '去看看其它宝贝', '我的优选')
      case -3000:
        return this.popupHtml('您还未获得宝贝兑换资格哦~', `消耗${type}次还款次数抢`, '我的优选', `您当前共有<b>${times}次还款次数可消耗</b>`)
      case -3001:
        return this.popupHtml('亲，请点击我的惠选<br />查看你兑换的商品信息~')
      case -3002:
        return this.popupHtml('本期心愿已收集完毕，<br />敬请期待下一期哦~')
      default:
        return this.popupHtml()
    }
  }

  showWish (wish) {
    if (wish) {
      return `<div class='text'><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><h3>我的愿望</h3><p class='p-wish'>${wish.wish}</p>${wish.status === '2' ? '<div class="wish"></div>' : ''}</div>`
    }
    return `<div class='text'><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><h3>我的愿望</h3><p class='p-wish'>你当前还没有愿望哦~<br />快去许愿吧~</p><a class='click'>朕知道了</a></div>`
  }

  showInput (type) {
    return `<div class='text'><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><h3>说出你的${type === 'ihelp' ? '愿望' : '想法'}</h3><textarea placeholder='不要超过120个字符哦~' maxlength='120'></textarea><a class='click'>立即发送</a></div>`
  }

  showRule () {
    return `<h3>活动规则</h3><div class='rule-content'><h4>一、发表愿望需求</h4><p>现金卡平台用户均可在“金粉i帮”专区，说出你想要实现的小愿望。</p><h4>二、平台筛选愿望</h4><p>愿望收集将在每月20日当天24点结束，三个工作日内筛选出5个合理的愿望，展示在许愿池，用户也可以在【查看我的愿望】中查看是否通过，通过用户会有盖章显示。<p><h4>三、确认愿望名单</h4><p>在公布入选名单后的12个小时内，我们将联系入选用户沟通实现愿望相应的事宜。用户确认参与，即指派任务。</p><h4>四、完成任务上传资料</h4><p>入选用户完成相应的任务并按照要求将相应的结果或者素材提交给官方工作人员。</p><h4>五、发放i帮基金</h4><p>官方工作人员确定结果或者素材符合要求，即向用户账户发放最高1000元现金以帮助用户实现愿望。</p></div>`
  }

  showReceving (addr) {
    return `<h3>收货信息</h3><div class='input-content'><div class='name'><span>姓&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp名</span><input class='name-input' placeholder='收货人姓名' /></div><div class='phone'><span>联系方式</span><input class='phone-input' maxlength='11' placeholder='手机号' /></div><div class='address' style='${addr ? '' : 'display: none;'}'><span>收货地址</span><input class='address-input' placeholder='详细地址' /></div><a class='click'>确认收货信息</a><h5><b>*</b>联系方式不填默认为个人注册手机号</h5></div>`
  }

  showVideo (img, link) {
    return `<video className='video-1' controls='controls' poster='${img}'><source src='${link}' type='video/mp4' /></video>`
  }

  passVideo (pass) {
    const html = pass.length > 0 ? pass.map((v, i) => `<h6>第${v.batch_text}期：<a href='${v.link}'>${v.title}</a></h6>`) : '<h6>当前暂无往期视频</h6>'
    let passHtml = ''
    for (let i in html) {
      passHtml = passHtml + html[i]
    }
    return `<h3>往期视频</h3><div class='pass'>${passHtml}</div>`
  }
}()
