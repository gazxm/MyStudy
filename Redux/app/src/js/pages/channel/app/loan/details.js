import qs from 'qs'
import React, {Component} from 'react'
import {List, Steps, Icon, Button, Toast, Checkbox} from 'antd-mobile'
import classnames from 'classnames'
import request from 'common/request'
import {redirect, goHome} from 'utils'
import 'scss/channel/app/loan/details.component.scss'

const title = '订单详情页'
const Step = Steps.Step
const Item = List.Item
const Brief = Item.Brief
const AgreeItem = Checkbox.AgreeItem

export default class details extends Component {
  state = {
    lock: true,
    loaded: false
  }
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    document.title = title
    let {middleware} = this.props
    let {query} = this.props.location
    Toast.loading(undefined, 0)
    request.post('pool/order/order-detail', {
      ...query
    }).then(response => {
      let {title} = response.data
      // if(Array.isArray(response.data) && !response.data.length){
      //   Toast.fail('暂无订单', 3, redirect.goBack)
      //   return
      // }
      Toast.hide()
      title && (document.title = title)
      this.setState({
        ...response.data,
        loaded: true
      })
    }).catch(middleware.bind(this))
  }
  repayment () {
    let {lock} = this.state
    let {middleware} = this.props
    let {query} = this.props.location
    if(lock){
      Toast.loading(undefined, 0)
      this.setState({lock: false})
      request.post('/pool/order/handle-repayment', {
        ...query
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
    }
  }
  render () {
    let {info = {}, loaded} = this.state
    let {progress, repayment = {}} = info
    let {protocol} = repayment
    let {query} = this.props.location
    let plan = data => {
      let {title, subtitle, item} = data
      let {amount, history, status_label, periods, planned_at} = item
      return (
        <List renderHeader={() =>
          <div>
            <span>{title}</span>
            {subtitle ? <a onClick={() => {
              redirect.push({
                pathname: '/channel/app/repayment/plan',
                search: `?${qs.stringify(query)}`
              })
            }}>{subtitle}<Icon type='right' /></a> : false}
          </div>
        } className='bill'>
          <Item thumb={<span>{repayment.item.periods}</span>}>
            <div>
              {amount}
              <Brief>{history}</Brief>
            </div>
            <div>
              {status_label}
              <Brief>{repayment.item.planned_at}</Brief>
            </div>
          </Item>
        </List>
      )
    }
    let detailed = data => {
      let {title, item, total} = data
      if(Array.isArray(item) && total){
        item = item.concat(total)
      }
      return (
        <List renderHeader={() => title || '借款信息'} className='detailed_list'>
          {item.map((data, index) => (
            <Item key={index} extra={<span dangerouslySetInnerHTML={{__html: data.value}} />}>{data.key}</Item>
          ))}
        </List>
      )
    }
    let toolbar = data => {
      let {is_show_btn, repay_enabled, order_info} = data
      let {total} = order_info
      if(!is_show_btn) return false
      if(repay_enabled == 1){
        return (
          <div className='toolbar'>
            <span className='money'>剩余待还 <span>￥{total.value}</span></span>
            <span className='handle'>
              {
                // <Button type='primary' size='small'>申请续期</Button>
              }
              <Button type='primary' size='small' onClick={() => redirect.push({
                pathname: '/channel/app/repayment/plan',
                search: `?${qs.stringify(query)}`
              })}>立即还款</Button>
            </span>
          </div>
        )
      }else if(repay_enabled == 2){
        return (
          <Button className='toolbar-handle' type='primary' onClick={() => {
            try{
              goHome()
            }catch(e){}
          }}>再去逛逛</Button>
        )
      }else if(repay_enabled == 3){
        return (
          <Button className='toolbar-handle' type='primary' onClick={() => redirect.push({
            pathname: '/channel/app',
            ...query.product_id ? {
              search: `?product_id=${query.product_id}`
            } : {}
          })}>再去借</Button>
        )
      }
    }
    if (!loaded) return false
    return (
      <div className={classnames({
        'wrapper-channel-loan-details': true,
        'thought-toolbar': true
      })} style={{
        minHeight: document.documentElement.clientHeight
      }}>
        {(progress && Array.isArray(progress.item))
          ? <List renderHeader={() => progress.title || '借款进度'}>
            <Steps current={progress.item.findIndex(data => data.active == 1) || 0}>
              {progress.item.map((data, index) => (
                <Step key={index} title={data.status} description={data.content} icon={<Icon type='check-circle' />} />
              ))}
            </Steps>
          </List>
        : false}
        {repayment && (repayment.item && !Array.isArray(repayment.item)) ? plan(repayment) : false}
        {repayment && repayment.order_info ? detailed(repayment.order_info) : false}
          
        {(info && info.length)
            ? <List renderHeader={() => '借款信息'} className='detailed_list'>
              {info.map((data, index) => (
                <Item key={index} extra={<span dangerouslySetInnerHTML={{__html: data.value}} />}>{data.label}</Item>
              ))}
            </List>
        : false}
        {protocol ?
          <div className='am-list'>
            {(protocol.item && Array.isArray(protocol.item) && protocol.item.length) ?
              <List renderHeader={() => '交易协议'} className='agreement'>
                <Item>
                  {protocol.item.map((data, index) => (
                    <a key={index} href={data.link}>《{data.name}》</a>
                  ))}
                </Item>
              </List>
            : false}
            {protocol.info ?
              <div className='notice'>{protocol.info}</div>
            : false}
          </div>
        : false}
        {repayment && repayment.order_info ? toolbar(repayment) : false}
      </div>
    )
  }
}