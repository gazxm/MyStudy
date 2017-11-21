import React, {Component} from 'react'
import {Card, Button, ListView, Toast} from 'antd-mobile'
import classnames from 'classnames'
import request from 'common/request'
import {resolveUrl, redirect, goHome} from 'utils'
import 'scss/channel/app/repayment/list.component.scss'

const title = '近期待还'

export default class list extends Component {
  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
    this.state = {
      empty: false,
      loaded: false,
      dataSource: dataSource.cloneWithRows([])
    }
  }
  componentDidMount () {
    document.title = title
    let {middleware} = this.props
    let {empty, dataSource} = this.state
    let {query} = this.props.location
    request.post('pool/order/recently-should-repayment', query).then(response => {
      let {data} = response
      data && data.length && (dataSource = dataSource.cloneWithRows(data))
      if (Array.isArray(data) && !data.length) {
        empty = true
      }
      this.setState({
        empty,
        dataSource,
        loaded: true
      })
    }).catch(middleware.bind(this))
  }
  render () {
    let {loaded, empty, dataSource} = this.state
    let row = (data, index) => {
      let {card_type, order_id, product_id, name, icon, total_amount, repayment_status: description, repayment_type: repaymentText, repayment_time: date, highlight: status, repayment_url, is_xjk} = data
      let goto = () => {
        if (card_type == 1 || card_type == 2) {
          window.location.href = resolveUrl(`http://m.xianjincard.com/loan/loan-detail?id=${order_id}`)
        } else if (card_type == 3) {
          window.location.href = resolveUrl(`http://m.xianjincard.com/loan/loan-period-detail?id=${order_id}`)
        } else if (is_xjk) {
          window.location.href = repayment_url
        } else if (product_id) {
          redirect.push({
            pathname: '/channel/app/loan/details',
            search: `?product_id=${product_id}&order_id=${order_id}`
          })
        } else {
          Toast.fail('系统错误，请稍后重试')
        }
      }
      return (
        <Card key={index}>
          <Card.Header title={name} extra={
            <span className={classnames({
              active: status == 1
            })}>{description}</span>
          } thumb={icon} />
          <Card.Body>
            <div>
              <p>{total_amount}</p>
              <p>{repaymentText}</p>
            </div>
            <div>
              <p>{date}</p>
              <p>还款日期</p>
            </div>
            <Button type='ghost' size='small' inline onClick={goto}>我要还款</Button>
          </Card.Body>
        </Card>
      )
    }
    let height = document.documentElement.clientHeight
    if (!loaded) return false
    return (
      <div className='wrapper-channel-repayment-list'>
        {empty ? <div className='empty' style={{height}}>
          <div>
            <div className='icon' />
            <p>您还没有待还订单哦~</p>
            <Button type='primary' onClick={goHome}>立即申请借款</Button>
          </div>
        </div>
          : <ListView
            dataSource={dataSource}
            renderRow={row}
            style={{height}} />}
      </div>
    )
  }
};
