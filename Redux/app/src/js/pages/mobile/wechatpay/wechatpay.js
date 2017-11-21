import React from 'react'
import { Toast } from 'antd-mobile'
import { post, share } from 'utils'

export default class Result extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentDidMount () {
    document.title = '微信支付'
    share('wechatpay', {corner: 0})
    const { query } = this.props.location
    if (!(query.amount && query.orderid)) {
      Toast.fail('缺少必要信息', 2)
      return
    }
    this.fetch(query)
  }
  fetch (params) {
    Toast.loading('加载中...', 0)
    post('http://credit.xianjincard.com/v2/credit-card/get-wx-pay-args', {amount: params.amount, orderId: params.orderid}).then(data => data.data).then(response => {
      Toast.hide()
      if (response.code !== 0) {
        Toast.fail(response.message, 2)
        return
      }
      this.setState({
        appId: response.data.appId,
        timeStamp: response.data.timeStamp,
        signType: response.data.signType,
        packageStr: response.data.package,
        nonceStr: response.data.nonceStr,
        paySign: response.data.paySign,
        echoStr: JSON.stringify(response.data),
        orderid: params.orderid,
        return_url: response.return_url
      }, function () {
        if (typeof WeixinJSBridge === 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false)
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady)
            document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady)
          }
        } else {
          this.onBridgeReady()
        }
      })
    })
  }
  onBridgeReady () {
    const { return_url } = this.state
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          'appId': this.state.appId,     // 公众号名称，由商户传入
          'timeStamp': this.state.timeStamp,         // 时间戳，自1970年以来的秒数
          'nonceStr': this.state.nonceStr, // 随机串
          'package': this.state.packageStr,
          'signType': this.state.signType,         // 微信签名方式：
          'paySign': this.state.paySign // 微信签名
        },
        function (res) {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            window.location.replace(return_url)
          } else {
            Toast.fail('支付未成功', 3)
            // alert(res.err_msg)
            setTimeout(function () {
              // window.location.replace(`http://m.xianjincard.com/loan/loan-detail?id=${orderid}`)
              window.history.go(-1)
            }, 3000)
          }
          // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
        }
    )
  }
  render () {
    return (
      <div />
    )
  }
}
