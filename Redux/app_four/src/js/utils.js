import { browserHistory, hashHistory } from 'react-router'
import axios from 'axios'
import qs from 'qs'

let Uri = (function () {
  var hostname = location.hostname
  var reg = /(?:http(?:s)?:\/\/)?(?:www\.)?(.*?)\./
  var regR = /https?:\/\/(?:[^/]+\.)?([^./]+\.(?:com))(?:$|\/)/
  var m = hostname.match(reg)

  var domain = {
    credit: 'http://192.168.39.214/kdkj/credit/web/',
    api: 'http://192.168.39.214/kdkj/frontend/web/',
    h5: 'http://192.168.39.214/kdkj/h5/mobile/web/',
    h: '//' + location.hostname + ':8000/',
    m: '//' + location.hostname + '/mobile/web/'
  }

  if (m !== null) {
    if (m[1] === 'h') {
      domain = {
        credit: location.protocol + '//credit.xianjincard.com/',
        api: location.protocol + '//api.xianjincard.com/',
        h5: location.protocol + '//h5.xianjincard.com/',
        h: location.protocol + '//h.xianjincard.com/',
        m: location.protocol + '//m.xianjincard.com/'
      }
    }

    if (m[1] === 'pre-h') {
      domain = {
        credit: location.protocol + '//pre-credit.xianjincard.com/',
        api: location.protocol + '//pre-api.xianjincard.com/',
        h5: location.protocol + '//pre-h5.xianjincard.com/',
        h: location.protocol + '//pre-h.xianjincard.com/',
        m: location.protocol + '//pre-m.xianjincard.com/'
      }
    }

    if (m[1] === 'test-h') {
      domain = {
        credit: location.protocol + '//test-credit.xianjincard.com/',
        api: location.protocol + '//test-api.xianjincard.com/',
        h5: location.protocol + '//test-h5.xianjincard.com/mobile/web/',
        h: location.protocol + '//test-h.xianjincard.com/',
        m: location.protocol + '//test-m.xianjincard.com/'
      }
    }

    if (hostname === '192.168.39.214') {
      domain = {
        credit: location.protocol + '//' + location.hostname + '/kdkj/credit/web/',
        api: location.protocol + '//' + location.hostname + '/kdkj/frontend/web/',
        h5: location.protocol + '//' + location.hostname + '/kdkj/h5/mobile/web/',
        m: location.protocol + '//' + location.hostname + '/kdkj/mobile/web/'
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
  const versions = u.split('/')
  return {
    isApp: u.indexOf('kdxj') !== -1,
    isAndroid: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
    isIos: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
    isWeixin: u.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）
    isQQ: u.match(/\sQQ/i) === 'qq', // 是否QQ
    version: versions[versions.length - 1]
  }
}())

export function share (key, params) {
  const script = document.createElement('script')
  script.src = '//res.wx.qq.com/open/js/jweixin-1.0.0.js'
  script.onload = () => {
    const script = document.createElement('script')
    if (params) {
      let parameter = ''
      for (let [k, v] of Object.entries(params)) {
        parameter = `${parameter}&${k}=${v}`
      }
      script.src = resolveUrl(`https://credit.xianjincard.com/activity/default/wx-share?key=${key}${parameter}`)
    } else {
      script.src = resolveUrl(`https://credit.xianjincard.com/activity/default/wx-share?key=${key}`)
    }
    document.body.appendChild(script)
  }
  document.body.appendChild(script)
}
/*
  {
  'share_title': '现金卡重金招募区域代理人！',
  'share_body': '5000万赏金虚位以待，寻找与众不同的你，I want you！',
  'share_url': 'https://h5.xianjincard.com/activity/reward/index.html',
  'share_logo': 'http://h5.xianjincard.com/activity/reward/img/share.png',
  'type': '1'
  }
*/
export function partake (params) {
  var defaults = {
    'share_title': '',
    'share_body': '',
    'share_url': '',
    'share_logo': '',
    'type': '0',
    'platform': 'WEIXIN,WEIXIN_CIRCLE,QQ,QZONE,SMS_INVITE,SINA',
    'callback': '',
    'is_upload': '1'
  }
  Object.assign(defaults, params)
  window.nativeMethod && window.nativeMethod.shareMethod(JSON.stringify(defaults))
}

export function sendEventSDK (tick) {
  // maxent
  window.mj('activation', {tick: tick})

  // 同盾
  window._fmOpt = {
    partner: 'koudailc',
    appName: 'koudailc_h5_web',
    token: tick
  }
  var cimg = new Image()
  cimg.onload = function () {
    window._fmOpt.imgLoaded = true
  }
  cimg.src = 'https://fp.fraudmetrix.cn/fp/clear.png?partnerCode=koudailc&appName=koudailc_h5_web&tokenId=' + tick
  // createCount('//static.fraudmetrix.cn/fm.js?ver=0.1&t=' + (new Date().getTime() / 3600000).toFixed(0))

  window._saber = {
    partnerId: 'koudailc',
    tokenKey: tick
  }
  createCount('//df.baiqishi.com/static/webdf/saber.js?t=' + (new Date().getTime() / 3600000).toFixed(0))
}

export function census () {
  if (window.localStorage) {
    localStorage.setItem('isOpenApp', true)
  }

  createCount('//hm.baidu.com/hm.js?cb70b7ef18da057ea52aaf3b53609ec2')

  window._vds = window._vds || []
  window._vds.push(['setAccountId', '8fd2500ba4956d6d'])
  createCount('//dn-growing.qbox.me/vds.js')
  // maxent
  createCount('//res.id-linking.com/js/mjsdk-1.4.3.min.js', function () {
    window.mj('set_params', {
      url: '//trk.mxtrk.com/jta/event',
      tid: '79rctxsz5nkuc9dd9qax3ewf5hay691k'
    })
  })
}

function createCount (url, callback) {
  const script = document.createElement('script')
  script.src = url
  script.onload = callback
  script.async = true
  document.body.appendChild(script)
}

export function login (source = null, inviteCode = null, url) {
  let redirectUrl = url || location.href
  let u = platform.isApp ? 'koudaikj://app.launch/login/applogin' : resolveUrl('http://h5.xianjincard.com/mobile/index.html#/login?redirect_url=' + encodeURIComponent(redirectUrl))
  if (source !== null && !platform.isApp) {
    u += `&appMarket=${source}`
  }
  if (inviteCode !== null && !platform.isApp) {
    u += `&inviteCode=${inviteCode}`
  }
  location.href = u
}

/*
  url: http://api.xianjincard.com/accumulation-fund/check-login
  params: {a:1, b:2}
*/
export function get (url, params = null) {
  if (params !== null) {
    url = url + '?' + qs.stringify(params)
  }
  return axios.get(resolveUrl(url))
}
/*
  url: http://api.xianjincard.com/accumulation-fund/check-login
  params: {a:1, b:2}
*/
export function post (url, params) {
  return axios.post(resolveUrl(url), qs.stringify(params))
}

export function copy (text, tips = '复制成功!') {
  window.nativeMethod && window.nativeMethod.copyTextMethod('{"text":"' + text + '","tip":"' + tips + '"}')
}

export function forwardApp () {
  if (platform.isAndroid && !platform.isWeixin) {
    window.location.href = 'https://credit.xianjincard.com/download-app.html'
    return
  }
  if (platform.isIos && !platform.isWeixin) {
    window.location.href = 'https://itunes.apple.com/app/id1156410247?mt=8'
    return
  }
  window.location.href = 'https://api.xianjincard.com/download-app.html'
}

function openAppCallback (openUrl, callback) {
  // 检查app是否打开
  function checkOpen (cb) {
    var _clickTime = +(new Date())
    function check (elsTime) {
      if (elsTime > 3000 || document.hidden || document.webkitHidden) {
        cb(1)
      } else {
        cb(0)
      }
    }
    // 启动间隔20ms运行的定时器，并检测累计消耗时间是否超过3000ms，超过则结束
    var _count = 0, intHandle = null
    intHandle = setInterval(function () {
      _count++
      var elsTime = +(new Date()) - _clickTime
      if (_count >= 100 || elsTime > 3000) {
        clearInterval(intHandle)
        check(elsTime)
      }
    }, 20)
  }

  // 在iframe 中打开APP
  var ifr = document.createElement('iframe')
  ifr.src = openUrl
  ifr.style.display = 'none'
  if (callback) {
    checkOpen(function (opened) {
      callback && callback(opened)
    })
  }

  document.body.appendChild(ifr)
  setTimeout(function () {
    document.body.removeChild(ifr)
  }, 2000)
}

export function openApp () {
  let urlSchema = platform.isAndroid ? 'xianjincard://com.kdlc.mcc/openapp' : platform.isIos ? 'xjbk915164674://' : null
  if (urlSchema === null) {
    forwardApp()
    return
  }
  openAppCallback(urlSchema, (opened) => {
    if (!opened) {
      forwardApp()
    }
  })
}

export function hrefNative (type, url) {
  let params = {'type': type}
  if (url) {
    params = {'type': type, 'url': url}
  }
  window.nativeMethod && window.nativeMethod.returnNativeMethod(JSON.stringify(params))
  //  window.nativeMethod && window.nativeMethod.returnNativeMethod('{"type" : "0"}')
}

// 退出webview
export function back () {
  hrefNative(0)
}

// 跳转首页
export function goHome () {
  if (!platform.isApp) {
    location.href = resolveUrl('http://h.xianjincard.com/mobile')
    return
  }
  hrefNative(4)
}

// 跳认证
export function goCertification () {
  if (!platform.isApp) {
    location.href = resolveUrl('http://h.xianjincard.com/mobile/certification')
    return
  }
  hrefNative(3)
}

// 找回交易密码
export function retrievePassword () {
  if (platform.isApp) {
    hrefNative(2)
  } else {
    location.href = resolveUrl('https://h5.xianjincard.com/mobile/index.html#/my/findpaypassword?state=' + encodeURIComponent(location.href))
  }
}

// 唤起浏览器跳转
export function callBrowser (url) {
  if (platform.isApp) {
    hrefNative(10, url)
  } else {
    location.href = url
  }
}

export function navLeftButton (fn) {
  if (window.nativeMethod && window.nativeMethod.registerCallBack) {
    window.nativeMethod.registerCallBack('(' + fn.toString() + '())')
  }
}

export function navLeftButtonBack () {
  navLeftButton(back)
}
