import qs from 'qs'
import React, {Component} from 'react'
import {Modal, List, Flex, Slider, Tag, Icon, Toast, NoticeBar} from 'antd-mobile'
import classnames from 'classnames'
import request from 'common/request'
import {resolveUrl, redirect, hrefNative, back, platform, qc} from 'utils'
import 'scss/channel/app/home.component.scss'

const Item = List.Item
const native = {
  personInfo: 16,
  contact: 17,
}
const moxie = ['alipay', 'taobao', 'jingdong']
let timer;

export default class index extends Component {
  state = {
    buttonText: '马上申请',
    money: 0,
    termValue: undefined,
    service_fee: 0,
    pocket_amount: 0,
    total_fee: 0,
    service_fee_range: undefined,
    pocket_amount_range: undefined,
    total_fee_range: undefined,
    loaded: false
  }
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    this.query(true)
  }
  query(first){
    let {middleware} = this.props
    let {product_id} = this.props.location.query
    let {buttonText, termValue, service_fee_range, pocket_amount_range, total_fee_range} = this.state
    first && Toast.loading(undefined, 0)
    request.post('pool/order/loan-application', {
      product_id
    }).then(response => {
      Toast.hide()
      if(!(response.data instanceof Object)){
        Toast.fail('获取数据失败，请稍后重试', 3, redirect.goBack)
        return
      }
      let {button, title, max_amount, loan_term_set, loan_amount_set, loan_fee_config, toast_status, toast_message, pre_credit_status, pre_credit_message} = response.data
      title && (document.title = title)
      if(pre_credit_status == 2){
        setTimeout(() => {
          this.query()
        }, 30000)
      }
      if(toast_status){
        Modal.alert('提示', toast_message, [{
          text: '确定',
          onPress: () => {
            try{
              back()
              window.postMessage(JSON.stringify({type: '', data: null}))
              redirect.goBack()
            }catch(e){}
          }
        }])
      }else if(pre_credit_status == 0){
        Modal.alert('提示', pre_credit_message, [{
          text: '确定',
          onPress: () => {
            try{
              back()
              window.postMessage(JSON.stringify({type: '', data: null}))
              redirect.goBack()
            }catch(e){}
          }
        }])
      }
      if(button && button.type && button.target && button.label){
        buttonText = button.label
      }else if(button && button.label){
        buttonText = button.label
      }
      try{
        if(loan_term_set && Array.isArray(loan_term_set) && loan_term_set.length){
          // 返回默认期数
          let firstTerm = loan_term_set[0].value
          // 返回费率区间
          if(loan_amount_set && loan_term_set.length && loan_fee_config){
            let min = loan_amount_set[0].value
            let max = loan_amount_set[loan_amount_set.length - 1].value
            let minTerm = loan_term_set[0].value
            let maxTerm = loan_term_set[loan_term_set.length - 1].value
            let minFee = loan_fee_config[min][minTerm]
            let maxFee = loan_fee_config[max][maxTerm]
            service_fee_range = `${minFee.service_fee}~${maxFee.service_fee}`
            pocket_amount_range = `${minFee.pocket_amount}~${maxFee.pocket_amount}`
            total_fee_range = `${minFee.total_fee}~${maxFee.total_fee}`
          }
          termValue = firstTerm
        }
      }catch(e){}
      this.setState({
        buttonText,
        money: max_amount,
        termValue,
        service_fee_range,
        pocket_amount_range,
        total_fee_range,
        ...response.data,
        loaded: true,
      })
      this.onChange(max_amount)
    }).catch(response => {
      let {code, message, data = {}} = response
      let {product_id, order_id} = data
      if(code == 3){
        Toast.hide()
        redirect.replace({
          pathname: '/channel/app/loan/details',
          search: `?product_id=${product_id}&order_id=${order_id}`
        })
      }else{
        middleware.bind(this)(response)
        setTimeout(redirect.goBack, 3000)
      }
    })
  }
  onChange (value) {
    let {loan_fee_config, termValue} = this.state
    if (loan_fee_config && loan_fee_config[value]) {
      let money = loan_fee_config[value]
      let config = money[termValue]
      let {service_fee, pocket_amount, total_fee} = config
      this.setState({money: value, service_fee, pocket_amount, total_fee})
    }else{
      this.setState({money: value, service_fee: 0, pocket_amount: 0, total_fee: 0})
    }
  }
  loan(){
    let {product_id} = this.props.location.query
    let {button, money, termValue, loan_method} = this.state
    if(button && button.type && button.target){
      this.go(button)
      return
    }
    if(money && termValue && loan_method){
      redirect.push({
        pathname: '/channel/app/loan/checkout',
        search: `?loan_amount=${money}&loan_term=${termValue}&loan_method=${loan_method}&product_id=${product_id}`
      })
    }else{
      Toast.offline('请选择借款信息')
    }
  }
  go(data = {}){
    let {type, target} = data
    if(type == 'h5' || type == 'qq'){
      target && (window.location.href = target)
    }else if(type == 'app'){
      if(native[target]){
        hrefNative(native[target])
      }else if(moxie.indexOf(target) >= 0){
        let {middleware} = this.props
        Toast.loading(undefined, 0)
        request('credit-info/get-open-id', {
          params: {
            fun_name: target
          }
        }).then(response => {
          let {open_id} = response.data
          if(open_id){
            qc.track('Moxiecert', {openid: open_id, tasktype: target, type: ''})
            Toast.hide()
          }else{
            Toast.fail('系统繁忙，请稍后重试');
          }
        }).catch(middleware.bind(this))
      }
    }
  }
  onlineService(){
    if(window.nativeMethod && window.nativeMethod.callPhoneMethod && platform.isAndroid){
        window.nativeMethod.callPhoneMethod('400-681-2016')
    }else{
        window.location.href = 'tel:400-681-2016'
    }
  }
  render () {
    let {
      buttonText,
      verify_set: verifys,
      money,
      amount,
      amount_incr_value: inc_amount,
      min_amount,
      max_amount,
      loan_term_set: terms,
      loan_method_label,
      termValue,
      service_fee,
      pocket_amount,
      total_fee,
      service_fee_range,
      pocket_amount_range,
      total_fee_range,
      pre_credit_status,
      pre_credit_message,
      verify_status,
      service_phone,
      loaded
    } = this.state
    let row = (data, index) => {
      let {id, title, icon, type, target, status} = data
      // 运营商失效判断
      // if(id == 100 && status == 3){
      //   data.target = resolveUrl('http://h.xianjincard.com/channel/app/operator')
      // }
      let click = () => {
        this.go(data)
      }
      return (
        <Item
          key={index}
          onClick={click}
          arrow='horizontal'
          extra={<span className={classnames({
            status: true,
            // 未认证
            active: status == 0,
            // 审核中
            processing: status == 2,
            // 已失效
            disabled: status == 3,
          })}>
            {status == 0 ? '去认证' : false}
            {status == 1 ? '已认证' : false}
            {status == 2 ? '审核中' : false}
            {status == 3 ? '已失效' : false}
          </span>}
          thumb={<i style={{backgroundImage: icon ? `url(${icon})` : false}} />}>
          {title}
        </Item>
      )
    }
    let term = (data, index) => {
      let {id, value} = data
      let click = () => {
        this.setState({termValue: value})
        this.onChange(money)
      }
      return (
        <div key={index}>
          <a className={classnames({active: value == termValue})} onClick={click}>{value}{loan_method_label}</a>
        </div>
      )
    }
    if(!loaded) return false
    return (
      <div className='wrapper-channel-home' style={{
        minHeight: document.documentElement.clientHeight
      }}>
        {verify_status == 0 ? <NoticeBar>完成所有认证，获取授信金额</NoticeBar> : false}
        <List className='main'>
          <div className='amount'>
            <div className='money'>{money >= 0 ? money : max_amount}</div>
            <p>借款额度(元)</p>
          </div>
          <Slider defaultValue={max_amount} min={min_amount} max={max_amount} step={inc_amount ? parseInt(inc_amount, 10) : 1} onChange={this.onChange.bind(this)} />
          {(terms && Array.isArray(terms)) ?
            <div className='term'>
              {terms.map(term)}
            </div>
          : false}
          <div className='detailed'>
            <div>
              综合费用{total_fee || total_fee_range}元
              {
                // <i className='icon-info' />
              }
            </div>
            <div>到账金额{pocket_amount || pocket_amount_range}元</div>
          </div>
        </List>
        {verifys ?
          <List className='condition' renderHeader={() => '申请条件'}>
            {verifys.map(row)}
          </List>
        : false}
        {
          // <List>
          //   <Item onClick={() => {}}>提额认证</Item>
          // </List>
          // <div className='compensate'>2小时下款，慢就赔<Icon type='right' size='xxs' /></div>
        }
        {service_phone ? <div className='onlineService' onClick={this.onlineService.bind(this)}>联系客服<Icon type='right' size='xxs' /></div> : false}
        {pre_credit_status == 2 ?
          <div className='pre-credit'>
            <div>
              <Icon type='loading' size='lg'/>
              <p>{pre_credit_message}</p>
            </div>
          </div>
        : false}
        <div className='toolbar' onClick={this.loan.bind(this)}>{buttonText}</div>
      </div>
    )
  }
};
