import { browserHistory, hashHistory } from 'react-router'
import axios from 'axios'
import qs from 'qs'
import sa from 'sa-sdk-javascript'
import Toast from './components/Toast'
import compareVersions from 'compare-versions'
import qiancheng from 'common/qiancheng'

let Uri = (function () {
  var hostname = location.hostname
  var reg = /(?:http(?:s)?:\/\/)?(?:www\.)?(.*?)\./
  var regR = /https?:\/\/(?:[^/]+\.)?([^./]+\.(?:com))(?:$|\/)/
  var m = hostname.match(reg)

  var domain = {
    // credit: location.protocol + '//test-credit.xianjincard.com/',
    credit: 'http://192.168.39.214/kdkj/credit/web/',
    api: 'http://192.168.39.214/kdkj/frontend/web/',
    h5: 'http://192.168.39.214/kdkj/h5/mobile/web/',
    h: '//' + location.hostname + ':8000/',
    m: 'http://192.168.39.214/kdkj/mobile/web/',
    'api-hj': 'http://192.168.39.214/haojie_edebit/frontend/web/'
  }

  if (m !== null) {
    if (m[1] === 'h') {
      domain = {
        credit: location.protocol + '//credit.xianjincard.com/',
        api: location.protocol + '//api.xianjincard.com/',
        h5: location.protocol + '//h5.xianjincard.com/',
        h: location.protocol + '//h.xianjincard.com/',
        m: location.protocol + '//m.xianjincard.com/',
        'api-hj': location.protocol + '//api-hj.xianjincard.com/'
      }
    }

    if (m[1] === 'pre-h') {
      domain = {
        credit: location.protocol + '//pre-credit.xianjincard.com/',
        api: location.protocol + '//pre-api.xianjincard.com/',
        h5: location.protocol + '//pre-h5.xianjincard.com/',
        h: location.protocol + '//pre-h.xianjincard.com/',
        m: location.protocol + '//pre-m.xianjincard.com/',
        'api-hj': location.protocol + '//preapi-hj.xianjincard.com/'
      }
    }

    if (m[1] === 'test-h') {
      domain = {
        credit: location.protocol + '//test-credit.xianjincard.com/',
        api: location.protocol + '//test-api.xianjincard.com/',
        h5: location.protocol + '//test-h5.xianjincard.com/mobile/web/',
        h: location.protocol + '//test-h.xianjincard.com/',
        m: location.protocol + '//test-m.xianjincard.com/',
        'api-hj': location.protocol + '//testapi-hj.xianjincard.com/'
      }
    }

    if (hostname === '192.168.39.214') {
      domain = {
        credit: location.protocol + '//' + location.hostname + '/kdkj/credit/web/',
        api: location.protocol + '//' + location.hostname + '/kdkj/frontend/web/',
        h5: location.protocol + '//' + location.hostname + '/kdkj/h5/mobile/web/',
        m: location.protocol + '//' + location.hostname + '/kdkj/mobile/web/',
        'api-hj': location.protocol + '//' + location.hostname + '/haojie_edebit/frontend/web/'
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
export const qc = qiancheng

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
  qc.track('shareMethod', Object.assign(defaults, params))
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
  createCount('//static.fraudmetrix.cn/fm.js?ver=0.1&t=' + (new Date().getTime() / 3600000).toFixed(0))

  window._saber = {
    partnerId: 'koudailc',
    tokenKey: tick
  }
  createCount('//df.baiqishi.com/static/webdf/saber.js?t=' + (new Date().getTime() / 3600000).toFixed(0))
}

export function census () {
  if (window.sessionStorage && !window.sessionStorage.getItem('isOpenApp')) {
    sessionStorage.setItem('isOpenApp', true)
  }
  document.addEventListener('DOMContentLoaded', function (event) {
    createCount('//hm.baidu.com/hm.js?cb70b7ef18da057ea52aaf3b53609ec2')

    // window._vds = window._vds || []
    // window._vds.push(['setAccountId', '8fd2500ba4956d6d'])
    // createCount('//dn-growing.qbox.me/vds.js')
    // maxent
    createCount('//res.id-linking.com/js/mjsdk-1.4.3.min.js', function () {
      window.mj('set_params', {
        url: '//trk.mxtrk.com/jta/event',
        tid: '79rctxsz5nkuc9dd9qax3ewf5hay691k'
      })
    })
  })
}

function isUseSensors () {
  let version = '1.5.9'
  let isUseSDK = false
  try {
    compareVersions(platform.versions, version) >= 0 && (isUseSDK = true)
  } catch (error) {}

  return isUseSDK && platform.isApp
}

export function sensors () {
  sa.init({
    web_url: `https://data.xianjincard.com/?project=${process.env.NODE_ENV === 'production' ? 'production' : 'default'}`,
    server_url: `https://sc.xianjincard.com:8443/sa?project=${process.env.NODE_ENV === 'production' ? 'production' : 'default'}`,
    heatmap: {},
    show_log: false,
    use_app_track: isUseSensors()
  })
  if (Object.defineProperty) {
    Object.defineProperty(document, 'title', {
      set: function (newValue) {
        if (newValue !== '') {
          document.getElementsByTagName('title')[0].innerHTML = newValue
          sa.quick('autoTrack')
        }
      },
      get: function () {
        return document.getElementsByTagName('title')[0].innerHTML
      }
    })
  } else {
    sa.quick('autoTrack')
  }
}

export function createCount (url, callback) {
  const script = document.createElement('script')
  script.src = url
  script.onload = callback
  script.async = true
  document.body.appendChild(script)
}

export function login (source = null, inviteCode = null, url) {
  let redirectUrl = url || location.href
  let u = resolveUrl('http://h5.xianjincard.com/mobile/index.html#/login?redirect_url=' + encodeURIComponent(redirectUrl))
  if (platform.isApp) {
    qc.track('getSessionID').then(response => {
      redirect.push('/misc/quick-login')
    }).catch(response => {
      let {code} = response
      location.href = 'koudaikj://app.launch/login/applogin'
    })
    return
  }
  if (source == null && window.sessionStorage.getItem('appMarket')) {
    u += `&appMarket=${window.sessionStorage.getItem('appMarket')}`
  }
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
  if (platform.isApp) {
    qc.track('copyTextMethod', {
      text, tip: tips
    })
  } else {
    let input = document.createElement('input')
    input.setAttribute('value', text)
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    Toast.info(tips, 2)
  }
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
  // // APP主页
  // 'koudaikj://app.launch/main': 4,
  // // 忘记密码
  // 'koudaikj://app.launch/login/forgetpwd': 1,
  // // 忘记交易密码
  // 'koudaikj://app.launch/me/forgetpaypwd': 2,
  // // 认证中心
  // 'koudaikj://app.launch/auth': 3,
  // // 借款记录
  // 'koudaikj://app.launch/me/loan_list': 8,
  // // 优惠券
  // 'koudaikj://app.launch/me/coupon': 13
  let id = parseInt(type, 10)
  switch (id) {
    case 0:
      qc.track('popWindow')
      break
    case 1:
      qc.track('jump', {url: 'koudaikj://app.launch/login/forgetpwd'})
      break
    case 2:
      qc.track('jump', {url: 'koudaikj://app.launch/me/forgetpaypwd'})
      break
    case 3:
      qc.track('jump', {url: 'koudaikj://app.launch/auth'})
      break
    case 4:
      qc.track('jump', {url: 'koudaikj://app.launch/main'})
      break
    case 8:
      qc.track('jump', {url: 'koudaikj://app.launch/me/loan_list'})
      break
    case 10:
      qc.track('jump', {url, is_browser: 1})
      break
    case 13:
      location.href = resolveUrl('http://h.xianjincard.com/mobile/coupon')
      break
    case 14:
      qc.track('captureScreen')
      break
  }
  // let params = {'type': type}
  // if (url) {
  //   params = {'type': type, 'url': url}
  // }
  // window.nativeMethod && window.nativeMethod.returnNativeMethod(JSON.stringify(params))
  //  window.nativeMethod && window.nativeMethod.returnNativeMethod('{"type" : "0"}')
}

// 退出webview
export function back () {
  qc.track('popWindow')
}

// 跳转首页
export function goHome () {
  if (!platform.isApp) {
    location.href = resolveUrl('http://h.xianjincard.com/mobile')
    return
  }
  qc.track('jump', {url: 'koudaikj://app.launch/main'})
}

// 跳认证
export function goCertification () {
  if (!platform.isApp) {
    location.href = resolveUrl('http://h.xianjincard.com/mobile/certification')
    return
  }
  qc.track('jump', {url: 'koudaikj://app.launch/auth'})
}

// 找回交易密码
export function retrievePassword () {
  if (platform.isApp) {
    qc.track('jump', {url: 'koudaikj://app.launch/me/forgetpaypwd'})
  } else {
    location.href = resolveUrl('https://h5.xianjincard.com/mobile/index.html#/my/findpaypassword?state=' + encodeURIComponent(location.href))
  }
}

// 跳转至优惠券页
export function goCoupon () {
  location.href = resolveUrl('https://h.xianjincard.com/mobile/coupon')
}

// 跳转至签到页
export function goSignin () {
  location.href = resolveUrl('https://h.xianjincard.com/signin')
}

// 跳转至现金红包页
export function cashBonus () {
  location.href = resolveUrl('https://h.xianjincard.com/cash-bonus')
}
// 唤起浏览器跳转
export function callBrowser (url) {
  if (platform.isApp) {
    qc.track('jump', {url, is_browser: 1})
  } else {
    location.href = url
  }
}

export function navLeftButton (callback) {
  qc.track('registerCallBack', {callback})
}

// 添加统计
export function statistics (query = {}) {
  sa.track('customize', query)
  return new Promise(resolve => {
    setTimeout(resolve, 100)
  })
}

// 错误日志收集try catch
export function logException (ex) {
  const data = {
    url: location.href,
    userAgent: navigator.userAgent,
    msg: ex
  }
  const img = new Image()
  img.src = `https://api.flow99.com/flow/bug/report?${qs.stringify(data)}`
}

// 错误日志收集onerror
export function report () {
  window.onerror = (msg, url, line, col, error) => {
    // 没有URL不上报！上报也不知道错误
    if (msg !== 'Script error.' && !url) {
      return true
    }
    setTimeout(() => {
      var data = {}
      // 不一定所有浏览器都支持col参数
      col = col || (window.event && window.event.errorCharacter) || 0

      data.url = url
      data.line = line
      data.col = col
      data.userAgent = navigator.userAgent
      data.location = location.href

      if (!!error && !!error.stack) {
        // 如果浏览器有堆栈信息
        // 直接使用
        data.msg = error.stack.toString()
      }

      const img = new Image()
      img.src = `https://api.flow99.com/flow/bug/report?${qs.stringify(data)}`
    }, 0)
    return false
  }
}
