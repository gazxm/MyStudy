import React from 'react'
import classnames from 'classnames'
// import {Button} from 'antd-mobile'
import {navLeftButton, get, forwardApp as download} from 'utils'
import Toast from 'components/Toast'
import 'scss/mobile/repayment.result.component.scss'
import 'scss/mobile/wechat.component.scss'

let timer
const btnText = ['完成', '支付宝还款', '重新支付', '知道了']
const text = ['还款成功', '还款失败', '还款等待']
const clsName = ['success', 'fail', '']
export default class Result extends React.Component {
  state = {
    loaded: 1
  }
  constructor (props) {
    super(props)
    navLeftButton(function () {
      window.location.href = this.state.item.url
    })
    this.state = {item: null}
  }
  componentDidMount () {
    document.title = '支付结果'
    this.countdown()
  }
  countdown () {
    let count = 5
    this.setState({countdown_text: '5秒'})
    timer = setInterval(() => {
      this.setState({
        countdown_text: `${--count}秒`
      })
      if ( !!!count ) {
        timer && clearInterval(timer)
        this.setState({loaded: 0})
        this.fetch(this.props.params)
      }
    }, 1000)
  }
  fetch (params) {
    Toast.loading('加载中...')
    let {card_tag: cardTag} = this.props.location.query
    cardTag && (params.card_tag = cardTag)
    get('http://credit.xianjincard.com/credit-pay/pay-result-code', params).then((result) => {
      Toast.hide()
      return result.data
    }).then((data) => {
      (data.data.item && data.data.item.title) && (document.title = data.data.item.title)
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
    const {countdown_text, loaded, item} = this.state
    // if (item === null) {
    //   return null
    // }
    // this.polling(item.trade_code)
    return (
      <div>
        {(!loaded && item) ? <div class="repayment-result">
          <i class={clsName[item.trade_code]}></i>
          <h1>{item.trade_txt}</h1>
          <p>{item.message}</p>
          {item.trade_code == 1 ?
          <a className="btn" onClick={download}>下载APP</a>
          : <a className="btn" href={item.button_action}>{btnText[item.button]}</a>}
          {item.button_repay && <p>银行卡无法还款？点此<a href={item.button_repay}>试试支付宝还款</a></p>}
        </div>
        : <div className={classnames({'wrapper wrapper-mobile wrapper-mobile-transfer': true, loaded: true})}>
            <div className='main'>
              <div>
                <div className='title'>正在等待处理结果...</div>
                <div className='loading'>
                  <div className='countdown'>{countdown_text}</div>
                  <div className='loader'/>
                </div>
              </div>
            </div>
            <div className='tips'>温馨提示：结果返回前，请勿重复支付</div>
        </div>
        }
      </div>
    )
  }
}
