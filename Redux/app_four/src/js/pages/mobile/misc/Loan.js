import React from 'react'
import { Icon, List, Button, Checkbox, Popup } from 'antd-mobile'
const Item = List.Item
const AgreeItem = Checkbox.AgreeItem
// const alert = Modal.alert
// const CheckboxItem = Checkbox.CheckboxItem
import {post, redirect, sendEventSDK} from 'utils'
import 'scss/mobile/loan.component.scss'
import Toast from 'components/Toast'
import Password from 'components/Password'

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent)
let maskProps
if (isIPhone) {
  // Note: the popup content will not scroll.
  maskProps = {
    onTouchStart: e => e.preventDefault()
  }
}

export default class Loan extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      money: '',
      period: '',
      true_money: '',
      counter_fee: '',
      bank_name: '',
      card_no: '',
      coupon_total: '',
      coupon_list: [],
      real_pay_pwd_status: '',
      tips: '',
      couponIndex: -1,
      agree: true
    }
  }
  componentDidMount () {
    this.fetchData(this.props.params)
    // console.log(this.props)
  }
  fetchData (params) {
    Toast.loading('加载中...')
    post('http://credit.xianjincard.com/credit-loan/get-confirm-loan', params).then((result) => {
      Toast.hide()
      // 不能再借
      if (result.data.code === -1) {
        Toast.info(result.data.message, 2, () => {
          redirect.goBack()
        })
        return
      }
      if (result.data.code !== 0) {
        Toast.info(result.data.message, 2)
        return
      }
      // 默认优惠券数组第一个是选中
      if (this.state.couponIndex !== -1) {
        result.data.data.item.couponIndex = 0
      }
      this.setState({...result.data.data.item})
      // console.log(result)
    }).catch(error => error)
  }
  item (couponList) {
    return couponList.map((rowData, i) => {
      const title = parseInt(rowData.use_case) === 4 ? <h3>{rowData.title}</h3> : <h4><i>￥</i>{rowData.amount}</h4>
      return (
        <div key={i} class="coupon-item" onClick={this.onChange.bind(this, i)}>
          <span>{title}</span>
          <span class="active">
            <div>
              <h3>{rowData.coupon_name}</h3>
              <p>{rowData.loan_amount}</p>
              <p>{rowData.loan_term}</p>
              <p>{rowData.time}</p>
              <b class={i === this.state.couponIndex && 'active'}></b>
            </div>
          </span>
        </div>
      )
    })
  }
  onChange = (i) => {
    Popup.hide()
    this.setState({couponIndex: i})
    const {params} = this.props
    params.coupon_id = this.state.coupon_list[i].coupon_id
    // console.log(params)
    redirect.replace(`/mobile/loan/${params.card_type}/${params.period}/${params.money}/${params.coupon_id}`)
    this.fetchData(params)
  }
  onSelected () {
    const {coupon_list} = this.state
    if (coupon_list.length <= 0) return

    Popup.show(
      <div class="loan-popup">
        <h1>可用优惠券<Icon type="cross" onClick={() => { Popup.hide() }}/></h1>
        <div class="content">
          <div class="warp">{this.item(coupon_list)}</div>
          <div class="button"><Button className="btn" onClick={this.onCancel.bind(this)}>不使用优惠券</Button></div>
        </div>
      </div>,
      { animationType: 'slide-up', maskProps, maskClosable: false }
    )
  }
  onCancel () {
    Popup.hide()
    this.setState({couponIndex: -1})
    const {params} = this.props
    console.log(params)
    redirect.push(`/mobile/loan/${params.card_type}/${params.period}/${params.money}`)
  }
  onAgree (e) {
    this.setState({agree: !this.state.agree})
  }
  onSubmit () {
    const {real_pay_pwd_status: hasPay} = this.state
//    console.log(real_pay_pwd_status)
    hasPay === 1 ? this.onConfirm() : this.onPassword()
  }
  onConfirm () {
    Password.show((value) => {
      this.confirm(value)
    }, '请输入交易密码')
  }
  confirm (password) {
    let {params} = this.props
    params.pay_password = password
    Toast.loading('加载中...')
    post('http://credit.xianjincard.com/credit-loan/apply-loan', params).then((result) => {
      Toast.hide()
      // console.log(result)
      let data = result.data
      if (data.code === 3) {
        Password.error()
        return
      }
      if (data.code === 0) {
        // 借款成功
        Password.remove()
        sendEventSDK(data.item.tick)
        redirect.push('/mobile/loan')
        return
      }
      Toast.info(data.message, 2)
    })
  }
  onPassword () {
    Password.show((value) => {
      Password.show((password) => {
        this.setPassword(value, password)
      }, '请确认交易密码')
    }, '请设置交易密码')
  }
  setPassword (old, password) {
    console.log(old, password)
    if (old !== password) {
      Password.error('两次输入交易密码不同')
      return
    }
    Toast.loading('加载中...')
    post('http://credit.xianjincard.com/credit-user/set-paypassword', {'password': password}).then((result) => {
    //  console.log(result)
      Toast.hide()
      if (result.data.code === 0) {
        Toast.info(result.data.message, 1, () => {
          this.onConfirm()
        })
        return
      }
      Toast.info(result.data.message, 2)
    })
  }
  render () {
    const data = this.state
    let amountStr = '不使用券'
    if (data.coupon_list.length > 0) {
      if (data.couponIndex >= 0) {
        amountStr = data.coupon_list[data.couponIndex]['str_amount']
      } else if (this.props.params.coupon_id !== undefined) {
        data.coupon_list.map((v, i) => {
          if (parseInt(v.coupon_id) === parseInt(this.props.params.coupon_id)) {
            data.couponIndex = i
            amountStr = v.str_amount
            return
          }
        })
      }
    } else {
      amountStr = ''
    }
    // <a href="">《平台服务协议》</a><br/><a href="">《授权扣款委托书》</a>
    return (
      <div class="loan-confirm">
        <List class="loan-list">
          <Item extra={data.money + '(元)'}>借款金额</Item>
          <Item extra={data.period + '(天)'}>借款期限</Item>
          <Item extra={data.true_money + '(元)'}>实际到帐</Item>
          <Item extra={data.counter_fee + '(元)'}>服务费用</Item>
          <Item extra={data.bank_name}>到帐银行</Item>
          <Item extra={data.card_no}>取现卡号</Item>
        </List>
        <List class="select-item"><Item class={data.couponIndex >= 0 && 'active '} extra={amountStr} arrow={!amountStr || 'horizontal'} onClick={this.onSelected.bind(this)}>可用券<i>{data.coupon_total}张可用券</i></Item></List>
        <p class="info" dangerouslySetInnerHTML={{__html: data.tips.replace(/(\d+\.?\d+)/g, '<b>$1</b>')}}></p>
        <div class="button"><Button disabled={!data.agree} type="primary" onClick={this.onSubmit.bind(this)}>确认申请</Button></div>
        <AgreeItem data-seed="logId" defaultChecked={data.agree} onChange={this.onAgree.bind(this)}>
          我已阅读并同意<a href={data.protocol_url}>《借款协议》</a>
        </AgreeItem>
        <div class="bg-logo"></div>
      </div>
    )
  }
}
