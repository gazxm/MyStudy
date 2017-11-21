import React from 'react'
import classnames from 'classnames'
// import {Button} from 'antd-mobile'
import {navLeftButton, get, resolveUrl, goHome, back, qc} from 'utils'
import {Modal} from 'antd-mobile'
import Toast from 'components/Toast'
import 'scss/mobile/repayment.result.component.scss'
import 'scss/mobile/wechat.component.scss'

let timer
const btnText = ['完成', '支付宝还款', '重新支付', '知道了']
const text = ['还款成功', '还款失败', '还款等待']
const clsName = ['success', 'fail', '']
export default class Result extends React.Component {
  state = {
    loaded: 1,
    tipsVisible: 0,
    descriptionVisible: 0
  }
  constructor (props) {
    super(props)
    this.state = {item: null}
    qc.track('registerCallBack', {
      callback(){
        qc.track('popWindow')
      }
    })
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
      if (!count) {
        timer && clearInterval(timer)
        this.setState({loaded: 0})
        this.fetch(this.props.params)
      }
    }, 1000)
  }
  fetch (params) {
    Toast.loading('加载中...')
    let {card_tag: cardTag, alipays} = this.props.location.query
    cardTag && (params.card_tag = cardTag)
    if (alipays !== undefined) {
      params.alipays = 1
    }
    get('http://credit.xianjincard.com/credit-pay/pay-result-code', params).then((result) => {
      Toast.hide()
      return result.data
    }).then((data) => {
      (data.data.item && data.data.item.title) && (document.title = data.data.item.title)
      if (data.data.item && data.data.item.is_delay && data.data.item.arg_param) {
        qc.track('addCalendarRemind', {
          date: data.data.item.arg_param
        })
      }
      if (data.data.item && data.data.item.tip && typeof data.data.item.tip === 'object') {
        this.setState({tipsVisible: 1})
      }
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
    const {tipsVisible, descriptionVisible, countdown_text, loaded, item} = this.state
    const {alipays, orderId, amount} = this.props.location.query
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
          {(item.trade_code == 1 && alipays !== undefined) ?
          <div>
            <a className="btn" href={resolveUrl(`http://m.xianjincard.com/loan/loan-repayment-type?id=${orderId}`)}>选择其他还款方式</a>
            <a className="btn ghost" href={resolveUrl(`http://h.xianjincard.com/mobile/repayment/alipay?orderId=${orderId}&amount=${amount}`)}>重新支付</a>
          </div>
          :
          <a className="btn" onClick={() => window.location.replace(item.button_action)}>{typeof item.button === 'number' ? btnText[item.button] : item.button}</a>
          }
          {item.button_repay && <p>银行卡无法还款？点此<a href={item.button_repay}>试试支付宝还款</a></p>}
          {typeof item.tip === 'object' ?
            <div>
              <Modal className='repayment-result-modal-upAmount' visible={tipsVisible} closable transparent onClose={() => this.setState({tipsVisible: 0})}>
                <div className='tips'>{item.tip.content}</div>
                <div className='upAmountTipsHandle'><span onClick={() => this.setState({tipsVisible: 0, descriptionVisible: 1})}>{item.tip.title}</span></div>
                <div className='handle'>
                  {item.tip.cancel ? <div className='cancel' onClick={() => this.setState({tipsVisible: 0})}>{item.tip.cancel || '取消'}</div> : ''}
                  <div className='submit' onClick={() => goHome()}>{item.tip.button || '确定'}</div>
                </div>
              </Modal>
              <Modal className='repayment-result-modal-upAmountTips' visible={descriptionVisible} closable transparent onClose={() => this.setState({descriptionVisible: 0})}>
                <div className='tips' dangerouslySetInnerHTML={{__html: (item.tip.description || '').replace(/\{/, '<span>').replace(/\}/, '</span>').replace(/%s/g, '<br/>')}}></div>
              </Modal>
            </div>
          : ''}
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
