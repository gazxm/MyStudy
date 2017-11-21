import qs from 'qs'
import React, {Component} from 'react'
import {Button, List, Modal, Toast, SegmentedControl, Icon, ActivityIndicator} from 'antd-mobile'
import classnames from 'classnames'
import request from 'common/request'
import Password from 'components/Password'
import {redirect} from 'utils'
import 'scss/channel/app/repayment/plan.component.scss'

const title = '还款计划'
const Item = List.Item
const Brief = Item.Brief

export default class plan extends Component {
  state = {
    type: 0,
    modal: {
      visible: false
    },
    lock: true,
    loaded: false
  }
  constructor (props) {
    super(props)
    let {type} = this.props.location.query
    type > 0 && (this.state.type = 1)
  }
  componentDidMount () {
    let {query} = this.props.location
    let {middleware} = this.props
    document.title = title
    request.post('pool/order/associates-repayment-list', query).then(response => {
      this.setState({
        ...response.data,
        loaded: true
      })
    }).catch(middleware.bind(this))
  }
  onChange (event) {
    let {nativeEvent} = event
    this.setState({type: nativeEvent.selectedSegmentIndex})
  }
  repayment () {
    let {lock, current = {}} = this.state
    let {middleware} = this.props
    let {query} = this.props.location
    if(current.status == 1){
      Toast.offline('您已经处于还款中，请注意不要重复提交还款')
      return
    }
    Password.show(password => {
      if(lock){
        Toast.loading(undefined, 0)
        this.setState({lock: false})
        Password.remove()
        setTimeout(() => {
          request.post('/pool/order/handle-repayment', {
            ...query,
            pay_password: password
          }).then(response => {
            let {message} = response
            this.setState({lock: true})
            Toast.success(message, 3, () => {
              redirect.push({
                pathname: '/channel/app/loan/details',
                search: `?${qs.stringify(query)}`
              })
            })
          }).catch(middleware.bind(this))
        })
      }
    })
  }
  showDetailed(detailed, index, total){
    let {modal} = this.state
    modal.title = `第${index + 1}/${total}期`
    modal.content = (
      <List>
          {detailed.total_amount !== undefined ? <Item extra={`${detailed.total_amount}元`}>本期应还金额</Item> : false}
          {detailed.principle !== undefined ? <Item extra={`${detailed.principle}元`} className='children'>本金</Item> : false}
          {detailed.service_fee !== undefined ? <Item extra={`${detailed.service_fee}元`} className='children'>综合费用</Item> : false}
          {detailed.overdue_fee !== undefined ? <Item extra={`${detailed.overdue_fee}元`} className='children'>逾期管理费</Item> : false}
          {detailed.residual_repayment !== undefined ? <Item extra={`${detailed.residual_repayment}元`}>本期已还金额</Item> : false}
          {detailed.plan_due_time !== undefined ? <Item extra={`${detailed.plan_due_time}${detailed.is_overdue == 1 ? ' - 已逾期' : ''}`}>到期还款日</Item> : false}
          {detailed.true_repayment_time !== undefined ? <Item extra={detailed.true_repayment_time}>实际还款日</Item> : false}
      </List>
    )
    modal.visible = true
    this.setState({modal})
  }
  closeDetailed(){
    let {modal} = this.state
    modal.visible = false
    this.setState({modal})
  }
  render () {
    let {is_show_current, is_all_repaymet_tatus, type, current = {}, plan = {}, modal, loaded} = this.state
    if(!is_show_current) type = 1
    // 本期还款
    // let thisPeriod = (repayment = {}) => {
    //   let {items, status} = repayment
    //   return (
    //       <div>
    //           {items && items.length ?
    //               <List className='detailed_list'>
    //                   {items.map((data, index) => (
    //                       <Item key={index} extra={data.value}>{data.label}</Item>
    //                   ))}
    //               </List>
    //           : false}
    //           {!status ? <Button type='primary' onClick={this.submit.bind(this)}>立即还款</Button> : false}
    //       </div>
    //   )
    // }
    // // 还款计划
    // let fullRepayment = (repayment = {}) => {
    //   let {amount = <Icon type='loading' size='xxs'/>, items, notice} = repayment
    //   let row = (data, index) => {
    //     let {period, newBalance, repayment, paymentDueDate, status, detailed} = data
    //     return (
    //        <tr key={index} className={classnames({disabled: status})} onClick={!status ? this.showDetailed.bind(this, detailed, index, items.length) : false}>
    //          <td>{period}期</td>
    //          <td>{newBalance}元</td>
    //          <td>{repayment}元</td>
    //          <td>{paymentDueDate}</td>
    //          <td className='status'>{status ? '已' : '未'}还</td>
    //        </tr>
    //     )
    //   }
    //   return (
    //       <div>
    //           <List className='plan'>
    //             <Item className='amount' extra={amount} >剩余应还总额</Item>
    //             {items && items.length ?
    //               <table>
    //                 <thead>
    //                   <tr>
    //                     <th>期数</th>
    //                     <th>应还</th>
    //                     <th>待还</th>
    //                     <th>还款日</th>
    //                     <th>状态</th>
    //                   </tr>
    //                 </thead>
    //                 <tbody>
    //                   {items.map(row)}
    //                 </tbody>
    //               </table>
    //             : false}
    //           </List>
    //           {notice ?
    //             <div className='notice'>{notice}</div>
    //           : <Button type='primary' onClick={this.submit.bind(this)}>立即还款</Button>}
    //       </div>
    //   )
    // }
    let row = (data, index) => {
      let {period, total_amount, stay_amount, plan_due_time, true_repayment_time, repayment_message, status} = data
      is_all_repaymet_tatus == 1 && (status = 0)
      return (
        <tr key={index} className={classnames({disabled: status == 1})} onClick={this.showDetailed.bind(this, data, index, plan.list.length)}>
          <td>{period}期</td>
          <td>{total_amount}元</td>
          <td>{stay_amount}元</td>
          <td>{plan_due_time}</td>
          <td className='status'>{repayment_message}</td>
        </tr>
      )
    }
    if(!loaded) return false
    return (
      <div className='wrapper-channel-repayment-plan'
      style={{
        height: document.documentElement.clientHeight
      }}>
        {is_show_current == 1 ? <SegmentedControl selectedIndex={type} values={['本期还款', '还款计划']} onChange={this.onChange.bind(this)} tintColor='#4ab6fa'/> : false}
        {type == 0 ?
          <div>
            <List className='detailed_list'>
              {current.total_amount !== undefined ? <Item extra={`${current.total_amount}元`}>本期应还</Item> : false}
              {current.paid_amount !== undefined ? <Item extra={`${current.paid_amount}元`}>本期已还</Item> : false}
              {current.plan_due_time !== undefined ? <Item extra={current.plan_due_time}>到期还款日</Item> : false}
              {current.overdue_day !== undefined ? <Item extra={current.overdue_day}>逾期天数</Item> : false}
              {current.overdue_fee !== undefined ? <Item extra={`${current.overdue_fee}元`}>逾期管理费</Item> : false}
              {current.residual_repayment !== undefined ? <Item extra={`${current.residual_repayment}元`}>剩余应还</Item> : false}
            </List>
            <Button type='primary' disabled={current.status == 3} onClick={this.repayment.bind(this)}>{current.status == 3 ? '本期已还清' : '立即还款'}</Button>
          </div>
        : false}
        {type == 1 ?
          <div>
            <List className='plan'>
              <Item className='amount' extra={`${plan.surplus_total}元`}>剩余应还总额</Item>
              <table>
                <thead>
                  <tr>
                    <th>期数</th>
                    <th>应还</th>
                    <th>待还</th>
                    <th>还款日</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.list ? plan.list.map(row) : false}
                </tbody>
              </table>
            </List>
          </div>
        : false}
        {
          // {type == 0 ? thisPeriod(repayment) : false}
          // {type == 1 ? fullRepayment(full_payment) : false}
        }
        <Modal className='wrapper-channel-repayment-plan-modal' title={modal.title} visible={modal.visible} onClose={this.closeDetailed.bind(this)} maskClosable transparent>
          {modal.content}
          <Button type='primary' size='small' inline onClick={this.closeDetailed.bind(this)}>我知道了</Button>
        </Modal>
      </div>
    )
  }
};
