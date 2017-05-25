import React from 'react'
import {Modal, List, Button} from 'antd-mobile'
const Item = List.Item
const alert = Modal.alert

import { connect } from 'react-redux'
import { redirect, login } from 'utils'
import 'scss/components/fund-security.component.scss'
import * as fund from '../../actions/securityFundActions'

import Toast from '../../components/Toast'

// 0认证失败 1已认证 2认证中
const text = ['认证失败', '已认证', '认证中']
const textClass = ['fail', 'succeed', 'fail']

@connect((store) => {
  const list = store.securityFund.list
  return {
    items: list.items,
    fetched: list.fetched,
    fetching: list.fetching,
    code: list.code,
    message: list.message
  }
})
export default class FundList extends React.Component {
  componentDidMount () {
    document.title = '公积金认证'
    this.isMask = true
    clearTimeout(this.timeout)
    this.props.dispatch(fund.fetchFundList())
    // Toast.loading('加载中...', 3, function(){
    //   console.log('ok')
    // })
  }
  componentWillUpdate (nextProps, nextState) {
    const { fetching } = nextProps
    if (this.isMask) {
      fetching ? Toast.loading('加载中...') : Toast.hide()
    }
  }
  componentDidUpdate (prevProps, prevState) {
    const { fetched, code, message, items } = this.props
    if (fetched && code === -3) {
      alert('登录', '你还没有登录，请先登录', [
        { text: '确 定', onPress: () => login() }
      ])
      return
    }
    if (fetched && code !== 0 && code !== 1 && code !== -3) {
      Toast.info(message, 2)
      return
    }
    if (fetched && items.length <= 0) redirect.replace('/fund/certification')
  }
  componentWillUnmount () {
    clearTimeout(this.timeout)
  }
  poll (time) {
    this.timeout = setTimeout(() => {
      this.isMask = false
      this.props.dispatch(fund.fetchFundList())
    }, time * 1000)
  }
  render () {
    const { items, fetched } = this.props
    let list = null
    if (fetched && items && items.length) {
      items.map((item) => {
        if (parseInt(item.status) === 2) {
          this.poll(10)
          return
        }
      })
      list = items.map((item, i) => <Item key={i} extra={text[item.status]} className={textClass[item.status]}>{item.city}</Item>)
    }
    if (list === null) {
      return null
    }
    return (
      <div class="transition-group fund-security-certification">
        <List class="custom-list">
          {list}
        </List>
        <div class="custom-button">
          <Button className="btn" type="primary" onClick={() => { redirect.push('/fund/certification') }}>{items ? '继续添加' : '添加'}</Button>
        </div>
      </div>
    )
  }
}
