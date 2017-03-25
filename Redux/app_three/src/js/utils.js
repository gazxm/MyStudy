import { browserHistory, hashHistory } from 'react-router'
import axios from 'axios'
import qs from 'qs'

let Uri = (function () {
  var hostname = location.hostname
  var reg = /(?:http(?:s)?:\/\/)?(?:www\.)?(.*?)\./
  var regR = /https?:\/\/(?:[^/]+\.)?([^./]+\.(?:com))(?:$|\/)/
  var m = hostname.match(reg)

  var domain = {
    credit: '//' + location.hostname + '/credit/web/',
    api: '//' + location.hostname + '/frontend/web/',
    h5: '//' + location.hostname + '/h5/mobile/web/',
    h: '//' + location.hostname + '/'
  }

  if (m !== null) {
    if (m[1] === 'h') {
      domain = {
        credit: location.protocol + '//credit.xianjincard.com/',
        api: location.protocol + '//api.xianjincard.com/',
        h5: location.protocol + '//h5.xianjincard.com/'
      }
    }

    if (m[1] === 'pre-h') {
      domain = {
        credit: location.protocol + '//pre-credit.xianjincard.com/',
        api: location.protocol + '//pre-api.xianjincard.com/',
        h5: location.protocol + '//pre-h5.xianjincard.com/',
        h: location.protocol + '//pre-h.xianjincard.com/'
      }
    }

    if (m[1] === 'test-h') {
      domain = {
        credit: location.protocol + '//test-credit.xianjincard.com/',
        api: location.protocol + '//test-api.xianjincard.com/',
        h5: location.protocol + '//test-h5.xianjincard.com/mobile/web/',
        h: location.protocol + '//test-h.xianjincard.com/'
      }
    }

    if (hostname === '192.168.39.214') {
      domain = {
        credit: location.protocol + '//' + location.hostname + '/kdkj/credit/web/',
        api: location.protocol + '//' + location.hostname + '/kdkj/frontend/web/',
        h5: location.protocol + '//' + location.hostname + '/kdkj/h5/mobile/web/'
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

export function census () {
  const script = document.createElement('script')
  script.src = '//hm.baidu.com/hm.js?cb70b7ef18da057ea52aaf3b53609ec2'
  script.async = true
  document.body.appendChild(script)
}

export function login (url) {
  let redirectUrl = url || location.href
  let u = platform.isApp ? 'koudaikj://app.launch/login/applogin' : resolveUrl('http://h5.xianjincard.com/mobile/index.html#/login?redirect_url=' + encodeURIComponent(redirectUrl))
  location.href = u
}

export function get (url) {
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

// 退出webview
export function back () {
  window.nativeMethod && window.nativeMethod.returnNativeMethod('{"type" : "0"}')
}
