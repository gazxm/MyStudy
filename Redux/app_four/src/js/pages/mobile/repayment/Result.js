import React from 'react'
// import {Button} from 'antd-mobile'
import {navLeftButton, get} from 'utils'
import Toast from 'components/Toast'
import 'scss/mobile/repayment.result.component.scss'

const btnText = ['完成', '支付宝还款', '重新支付', '知道了']
const text = ['还款成功', '还款失败', '还款等待']
const clsName = ['success', 'fail', '']
export default class Result extends React.Component {
  constructor (props) {
    super(props)
    navLeftButton(function () {
      window.location.href = this.state.item.url
    })
    this.state = {item: null}
  }
  componentDidMount () {
    document.title = '还款结果'
    this.fetch(this.props.params)
  }
  fetch (params) {
    Toast.loading('加载中...')
    let {card_tag: cardTag} = this.props.location.query
    cardTag && (params.card_tag = cardTag)
    get('http://credit.xianjincard.com/credit-pay/pay-result-code', params).then((result) => {
      Toast.hide()
      return result.data
    }).then((data) => {
      if (data.code !== 0) {
        Toast.info(data.message, 2)
        return
      }
      this.setState({item: data.data.item})
    })
  }
  polling (code) {
    if (code === 2) {
      setTimeout(() => { this.fetch(this.props.params) }, 5000)
    }
  }
  render () {
    const {item} = this.state
    if (item === null) {
      return null
    }
    this.polling(item.trade_code)
    return (
      <div class="repayment-result">
        <i class={clsName[item.trade_code]}></i>
        <h1>{text[item.trade_code]}</h1>
        <p>{item.message}</p>
        <a className="btn" href={item.button_action}>{btnText[item.button]}</a>
        {item.button_repay && <p>银行卡无法还款？点此<a href={item.button_repay}>试试支付宝还款</a></p>}
      </div>
    )
  }
}
