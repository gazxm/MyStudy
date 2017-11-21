import React from 'react'
import {Toast} from 'antd-mobile';
import {get, post, login, redirect} from 'utils'

export default class Result extends React.Component {
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    document.title = '微信支付'
    if(!(this.props.params.amount && this.props.params.orderid)){
      Toast.fail("缺少必要信息", 2);
      return;
    }
    this.fetch(this.props.params)
  }
  fetch (params) {
    Toast.loading("加载中...", 0);
    post('http://credit.xianjincard.com/v2/credit-card/get-wx-pay-args',{amount : 10000,orderId: 32423}).then(data => data.data).then(response => {
      Toast.hide();
      if(response.code != 0) {
        Toast.fail(response.message, 2);
        return;
      }
      this.setState({
        appId : response.addId,
        timeStamp : response.timeStamp,
        signType : response.signType,
        packageStr : response.package,
        nonceStr : response.nonceStr,
        paySign : response.paySign
      }, function () {
        if (typeof WeixinJSBridge == "undefined"){
          if( document.addEventListener ){
            document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
          }else if (document.attachEvent){
            document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
          }
        }else{
          this.onBridgeReady();
        }
      });
    });
  }
  onBridgeReady(){
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          "appId":this.state.appId,     //公众号名称，由商户传入
          "timeStamp":this.state.timeStamp,         //时间戳，自1970年以来的秒数
          "nonceStr":this.state.nonceStr, //随机串
          "package":this.state.packageStr,
          "signType":this.state.signType,         //微信签名方式：
          "paySign":this.state.paySign //微信签名
        },
        function(res){
          if(res.err_msg == "get_brand_wcpay_request:ok" ) {
            alert("支付成功")
          }else{
            alert(res.err_msg)
          }
          // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
        }
    );
  }
  render () {
    return (
      <div></div>
    )
  }
}
