import { browserHistory, hashHistory } from 'react-router'

let Uri = (function () {
  var hostname = location.hostname
  var reg = /(?:http(?:s)?:\/\/)?(?:www\.)?(.*?)\./
  var regR = /https?:\/\/(?:[^/]+\.)?([^./]+\.(?:com))(?:$|\/)/
  var m = hostname.match(reg)

  var domain = {
    credit: '//' + location.hostname + '/credit/web/',
    api: '//' + location.hostname + '/frontend/web/',
    h5: '//' + location.hostname + '/h5/mobile/web/'
  }

  if (m !== null) {
    if (m[1] === 'h') {
      domain = {
        credit: '//credit.xianjincard.com/',
        api: '//api.xianjincard.com/',
        h5: '//h5.xianjincard.com/'
      }
    }

    if (m[1] === 'pre-h') {
      domain = {
        credit: '//pre-credit.xianjincard.com/',
        api: '//pre-api.xianjincard.com/',
        h5: '//pre-h5.xianjincard.com/'
      }
    }

    if (hostname === '192.168.39.214') {
      domain = {
        credit: '//' + location.hostname + '/kdkj/credit/web/',
        api: '//' + location.hostname + '/kdkj/frontend/web/',
        h5: '//' + location.hostname + '/kdkj/h5/mobile/web/'
      }
    }

    if (hostname === '121.42.12.69') {
      domain = {
        credit: '//' + location.hostname + '/koudai/kdkj/credit/web/',
        api: '//' + location.hostname + '/koudai/kdkj/frontend/web/',
        h5: '//' + location.hostname + '/koudai/kdkj/h5/mobile/web/'
      }
    }
  }

  return {
    resolveUrl: function (url) {
      var arr = url.match(reg)
      if (domain[arr[1]]) {
        return url.replace(regR, domain[arr[1]])
      }
    },
    domain: domain
  }
}())

export const redirect = process.env.NODE_ENV === `debug` ? hashHistory : browserHistory
export const resolveUrl = (url) => { return Uri.resolveUrl(url) }

export const platform = (function () {
  const u = navigator.userAgent
  return {
    isApp: u.indexOf('kdxj') !== -1,
    isAndroid: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
    isIos: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
    isWeixin: u.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）
    isQQ: u.match(/\sQQ/i) === 'qq' // 是否QQ
  }
}())

export function share (key) {
  const script = document.createElement('script')
  script.src = '//res.wx.qq.com/open/js/jweixin-1.0.0.js'
  script.onload = () => {
    const script = document.createElement('script')
    script.src = resolveUrl('https://credit.xianjincard.com/act/wx-share?key=' + key)
    document.body.appendChild(script)
  }
  document.body.appendChild(script)
}

export function census () {
  const script = document.createElement('script')
  script.src = '//hm.baidu.com/hm.js?3ac5a6a835b4ee96a11d699ee4f6b39a'
  script.async = true
  document.body.appendChild(script)
}

export function login (url) {
  let redirectUrl = url || location.href
  let u = platform.isApp ? 'koudaikj://app.launch/login/applogin' : resolveUrl('http://h5.xianjincard.com/mobile/index.html#/login?redirect_url=' + encodeURIComponent(redirectUrl))
  location.href = u
}

