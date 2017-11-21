import React from 'react'
import 'scss/mobile/repayment/choose.component.scss'

export default class choose extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div className='choose'>
        <div className='head'>
          <h4>待还款</h4>
          <h3>¥ 1000.00</h3>
        </div>
        <ul>
          <li className='bank-icon'> <a href=''> <h2>银行卡还款<b>官方推荐</b></h2> <i /> </a> </li>
          <li className='alipay alipay-icon'> <a href=''> <h2>支付宝还款</h2> <i /> </a> </li>
          <li className='wxpay-icon'> <a href=''> <h2>微信还款</h2> <i /> </a> </li>
          <div className='lookOtherRepay'>查看其他还款方式</div>
        </ul>
        <p>备注：若在借款期间内未发动主动还款，则默认于还款日当天从绑定银行卡建设银行卡（0749）自动扣除所借款项，请保证在扣款之前账户资金充足。</p>
      </div>
    )
  }
}
