let UA = navigator.userAgent
let isIOS = /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(UA)
let isAndroid = /Adr|Android/.test(UA)
let methods = ['addCalendarRemind', 'emailcert', 'Moxiecert', 'getDeviceId', 'registerCallBack', 'startUnicorn', 'copyTextMethod', 'shareMethod', 'jump', 'popWindow', 'captureScreen', 'qianchengAuthorize']
let schemes = {
  // APP主页
  'koudaikj://app.launch/main': 4,
  // 忘记密码
  'koudaikj://app.launch/login/forgetpwd': 1,
  // 忘记交易密码
  'koudaikj://app.launch/me/forgetpaypwd': 2,
  // 认证中心
  'koudaikj://app.launch/auth': 3,
  // 借款记录
  'koudaikj://app.launch/me/loan_list': 8,
  // 优惠券
  'koudaikj://app.launch/me/coupon': 13
}

function compatible () {
  return window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.QCJSInterface
}
// window.QCJSInterface = {
//   callApp(options){
//     console.log(options)
//   }
// }

function getCallbackID(name = 'callback'){
  let timestamp = new Date().getTime()
  return `QC_${name.toUpperCase()}_${timestamp}`
}

function isFunction (fn){
  return fn && typeof fn === 'function'
}

class qiancheng {
  static track (...options) {
    let [name, params = {}] = options
    let native = window.QCJSInterface || window.nativeMethod || compatible()
    let config = {method: name, params}
    let callbackid = getCallbackID(name)
    return new Promise((resolve, reject) => {
      QCJSAPI.cache[callbackid] = response => (response.code == 0 ? resolve : reject)(response)

      // 解决 Promise.resolve 无法重复执行 
      if (/registerCallBack|setRightNavButton/.test(name) >= 0 && isFunction(params.callback)) {
        let callback = params.callback
        QCJSAPI.cache[callbackid] = response => callback(response)
        delete params.callback
      }

      if (native && native.callApp) {
        config.callback = callbackid
        native.callApp(JSON.stringify(config))
      } else if (native && native.postMessage) {
        config.callback = callbackid
        native.postMessage(config)
      } else if (native && methods.find(method => method == name)) {
        if (['addCalendarRemind', 'copyTextMethod', 'shareMethod', 'jump'].indexOf(name) >= 0) {
          if (name == 'jump') {
            let {url, type} = params
            let scheme = schemes[url]
            if(scheme){
              params = {type: scheme}
              name = 'returnNativeMethod'
            }else if (type == 10) {
              params = {type, url}
            }else{
              window.location.href = url
              return
            }
          }
          native[name](JSON.stringify(params))
        } else if (name == 'registerCallBack') {
          let fn = function(callbackid){
            if (window.QCJSAPI && window.QCJSAPI.appCallback) {
              window.QCJSAPI.appCallback({callbackid, data: {code: 0, message: 'success', data: {}}})
            }
          }
          native[name](`(${fn.toString()}('${callbackid}'))`)
        } else if (name == 'getDeviceId') {
          let deviceid = native[name]()
          if (deviceid) {
            resolve({code: 0, message: 'success', data: {deviceid}})
          } else {
            reject({code: -1, message: 'failed to obtain deviceid', data: {}})
          }
        } else if(['emailcert', 'Moxiecert', 'startUnicorn'].indexOf(name) >= 0){
          let temp = []
          let {openid, tasktype, type} = params
          if (name == 'Moxiecert' && tasktype == 'email') {
            name = 'emailcert'
            delete params.tasktype
          }
          for (let i in params) {
            temp.push(params[i])
          }
          native[name](...temp)
        } else {
          let types = {
            popWindow: 0,
            qianchengAuthorize: 7,
            captureScreen: 14
          }
          if (typeof types[name] === 'number') {
            native.returnNativeMethod(JSON.stringify({type: types[name], params}))
          }
        }
      } else {
        reject({code: 1000, message: 'Interface isn`t support!'})
      }
    })
  }
}

function translate (data) {
  if (data instanceof Object) {
    return data
  } else if (typeof data === 'string' && /^"{|}"$/.test(data)) {
    return JSON.parse(data)
  } else {
    return {}
  }
}

class QCJSAPI {
  static cache = {}
  static appCallback (result) {
    try {
      let response = translate(result)
      let {callbackid, data} = result
      let callback = this.cache[callbackid]
      if (callback) {
        if(/GETSESSIONID/i.test(callbackid)){
          let response = data
          if(response instanceof Object){
            let temp = {}
            for(let i in response.data){
              let value = response.data[i]
              if(/SESSIONID/i.test(i)){
                i = String(i).toLowerCase()
              }
              temp[i] = value
            }
            response.data = temp
            data = response
          }
        }
        callback(data)
        if (!/REGISTERCALLBACK|SETRIGHTNAVBUTTON/i.test(callbackid)) {
          delete this.cache[callbackid]
        }
      }
    } catch (error) {}
  }
}
window.QCJSAPI = QCJSAPI

module.exports = qiancheng
