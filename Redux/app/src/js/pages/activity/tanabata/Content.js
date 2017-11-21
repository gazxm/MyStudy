export default new class Content {
  popupHtml (content = '服务器繁忙，请稍后重试', tips = '朕知道了', className = '') {
    return `<div class='text-content'><p class='${className}'>${content}</p><a class='click'>${tips}</a></div>`
  }

  showHtml (code, msg) {
    switch (code) {
      case -1014:
        return this.popupHtml('亲，您点击的太频繁了，<br />请耐心等待一会儿~')
      default:
        return this.popupHtml()
    }
  }
  showCard (pageType, picdata, wxpic, score, point, type) {
    let head = (pageType === 'friTanabata' ? `<h4>亲密指数<br/><b>${score}</b>分<br/>你们的亲密度超过了<i>${point}%</i>的人</h4><span>恭喜你点亮1张卡片</span>` : type === 1 ? `<h3>恭喜你点亮<b>1</b>张卡片</h3>` : `<h3>已拥有的卡片</h3>`)
    let button = (pageType === 'friTanabata' ? `<button class='blue-btn'>我要测</button>` : `<button class='blue-btn'>我的指数</button>`)
    let picdataTwo = new Array(8)

    for (let i = 0; i < 8; i++) {
      picdataTwo[i] = {}
    }

    picdata = picdata.map((v, i) => {
      picdataTwo[v.pic] = v
    })

    picdataTwo = picdataTwo.map((e, i) => {
      if (e.pic || e.pic === 0) {
        return `<li key=${i} class='card ${'card-' + e.pic}'' />`
      }
      if (wxpic && i === wxpic) {
        return `<li key=${i} class='card-weixin'/>`
      }
      return `<li key=${i} class='card' />`
    })

    let str = ''
    for (let i in picdataTwo) {
      str = str + picdataTwo[i]
    }

    return `${head} <ul>${str}</ul>${button}<p class='meta'>每测一个指纹就可以获得卡片<br />卡片为随机获取，不排除重复获取<br />集齐“祝七夕情人节快乐”即可获得<b>77元</b>现金红包</p></div>`
  }
  showRule () {
    return `<h3>游戏规则</h3><p>录入指纹的时候请思想放空<br/>录入时间需满5秒<br/>将录好的指纹发送给Ta<br/>在好友录入指纹后<br/>即可获得你们之间的亲密指数</p><p>活动时间：8月28日起</p><p>本活动最终解释权归现金卡所有，与苹果公司无关</p>`
  }
  showShareGuid () {
    return ` `
  }
  showRed () {
    return `<a class='click'>马上领取</a>`
  }
}()
