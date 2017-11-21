import React from 'react'
import { SegmentedControl, List, Button, Toast } from 'antd-mobile'
const Item = List.Item
import 'scss/mobile/repayment-projet.component.scss'
import {get} from 'utils'
import classNames from 'classnames'

const values = ['还本期', '还全款']
const methods = ['period', 'fullPayment']
export default class Projet extends React.Component {
  constructor (props) {
    super(props)
    document.title = '还款计划'
    this.state = {
      selectedIndex: 0,
      data: null
    }
  }
  componentDidMount () {
    const {id} = this.props.params
    this.fetchData(id)
  }

  fetchData (id) {
    Toast.loading('加载中....', 0)
    get('http://credit.xianjincard.com/v2/credit-loan/get-order-detail', {id: id}).then(response => {
      Toast.hide()
      const {code, message, data} = response.data
      if (code !== 0) {
        Toast.info(message, 2)
        return
      }
      this.setState({data: data.item})
    }).catch(error => error)
  }
  onChange (val) {
    // console.log(values.indexOf(val))
    this.setState({selectedIndex: values.indexOf(val)})
  }
  submit () {
    const {repayment_url: url, repayment_all_url: allUrl} = this.state.data
    location.href = this.state.selectedIndex === 0 ? url : allUrl
  }
  period () {
    const {recent_period_info: period} = this.state.data
    return (
      <List class="custom-list">
        <Item extra={period.should_repay_money}>本期还款额</Item>
        <Item extra={period.should_repay_time}>到期还款日</Item>
        <Item extra={period.overdue_day}>逾期天数</Item>
        <Item extra={period.overdue_fee}>逾期管理费</Item>
        <Item extra={period.repay_total}>应还总额</Item>
      </List>
    )
  }
  fullPayment () {
    const {whole_period_info: wholePeriodInfo, whole_total_amount: total} = this.state.data
    return (
      <ul>
        <li><span>期数</span><span>分期额</span><span>罚金/减免</span><span>应还额</span><span>状态</span></li>
        {wholePeriodInfo.map((v, k) => <li key={k} class={classNames({achieve: v.repay_status})}><span>{v.repay_period}</span><span>{v.repay_money}</span><span>{v.repay_fee}</span><span>{v.repay_total}</span><span>{v.repay_status === 1 ? '已还' : '未还'}</span></li>)}
        <li><p>剩余应还总额</p><h2>{total}</h2></li>
      </ul>
    )
  }
  render () {
    const {data} = this.state
    return (
      <div class="repayment-projet">
        <SegmentedControl values={values} tintColor={'#4ab6fa'} onValueChange={this.onChange.bind(this)} />
        {data && this[methods[this.state.selectedIndex]]()}
        <div class="custom-button">
          <Button className="btn" type="primary" onClick={this.submit.bind(this)}>立即还款</Button>
        </div>
      </div>
    )
  }
}
