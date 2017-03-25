import React from 'react'
import { Modal, List, Button } from 'antd-mobile'
const Item = List.Item
const alert = Modal.alert

import {connect} from 'react-redux'
import {redirect, login} from '../../utils'

import 'scss/components/fund-security-style.scss'

import * as security from '../../actions/securityFundActions'
import Toast from '../../components/Toast'

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
export default class SecurityList extends React.Component {
  componentDidMount () {
    document.title = '社保认证'
    this.props.dispatch(security.fetchSecurityList())
  }
  componentWillUpdate (nextProps, nextState) {
    const { fetching } = nextProps
    fetching ? Toast.loading('加载中...', 0) : Toast.hide()
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
    if (fetched && items.length <= 0) redirect.replace('/security/certification')
  }
  render () {
    const {items, fetched} = this.props
    let list = null
    if (fetched && items && items.length) {
      list = items.map((item, i) => <Item key={i} extra={parseInt(item.status) ? '已认证' : '认证失败'} className={parseInt(item.status) ? 'succeed' : 'fail'}> {item.city} </Item>)
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
          <Button className="btn" type="primary" onClick={() => { redirect.push('/security/certification') }}>{items ? '继续添加' : '添加'}</Button>
        </div>
      </div>
    )
  }
}
