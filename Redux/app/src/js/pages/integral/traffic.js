import React, {Component} from 'react'
import {createForm} from 'rc-form'

import {Modal, List, Button, Toast, Icon, InputItem} from 'antd-mobile'
import classnames from 'classnames'
import request from 'common/request'
import {login, redirect} from 'utils'

import 'scss/integral/traffic.component.scss'

let title = '金币商城'
let Item = List.Item
let Brief = Item.Brief
let tips = () => {
  return (
    <dl>
      <dt>友情提示：</dt>
      <dd>1、每位用户30天内仅可兑换一次，以成功兑换为准</dd>
      <dd>2、每日流量包的个数有限，先到先得</dd>
      <dd>3、充值成功后系统发送提示短信，具体以流量到账为准</dd>
      <dd>4、所兑换的流量到账后即时生效，当月有效</dd>
      <dd>5、如兑换失败，金币将退回您的账户中，可再次尝试</dd>
    </dl>
  )
}

String.prototype.trims = function () {
  return this.replace(/\s+/g, '')
}

function timeout (start, end) {
  let value = 0
  if (end - start < 1000) value = 1000
  if (end - start > 1000) value = 0
  return value
}

class traffic extends Component {
  state = {
    lock: 1,
    loaded: 1,
    loading: 0
  }
  componentDidMount () {
    document.title = title
    let {phone} = window.localStorage
    let {refs: {input: element}} = this.refs.phone
    if (this.validate(phone)) {
      this.onChange(phone)
      element.value = phone
    }
  }
  validate (value) {
    if (value && value.length === 11) {
      return true
    } else {
      this.setState({data: undefined})
      return false
    }
  }
  exchange (data, index) {
    let {phone, lock, gold_in_short} = this.state
    if(gold_in_short == 1){
      Modal.alert(undefined, '金币不足，兑换失败', [{
        text: '点此赚金币',
        onPress: () => redirect.push('/integral/tasks')
      }])
      return;
    }
    if (lock) {
      Modal.alert(undefined ,'确定兑换？', [{
        text: '取消'
      }, {
        text: '兑换',
        onPress: () => {
          Toast.loading(undefined, 0)
          this.setState({lock: 0})
          request.post(`/credit-gold/flow`, {
            phone,
            num: data.id
          }).then(response => {
            let {message} = response
            Toast.success('兑换成功', 3, () => {
              this.setState({lock: 1, disabled: 1})
            })
          }).catch(response => {
            let {code, message} = response
            Toast.hide()
            if (code == -1001) {
              Modal.alert('提 示', message, [{
                text: '取消'
              }, {
                text: '去登录',
                onPress: login
              }])
            } else if (code == -2102) {
              Modal.alert(undefined, '金币不足，兑换失败', [{
                text: '点此赚金币',
                onPress: () => redirect.push('/integral/tasks')
              }])
            } else if(code == -3305){
              Toast.fail(message);
            } else {
              Toast.fail('兑换失败，金币将返回账户')
            }
            this.setState && this.setState({lock: 1, loading: 0})
          })
        }
      }])
    }
  }
  onChange (value) {
    let phone = value.trims()
    let {lock} = this.state
    this.setState({phone})
    if (this.validate(phone) && lock) {
      this.setState({lock: 0, loading: 1})
      let start = Date.now()
      request(`/credit-gold/operator?phone=${phone}`).then(response => {
        let {attr: operator, list: data, only_read, gold_in_short} = response.result
        let end = Date.now()
        this.setState({operator, disabled: only_read, gold_in_short})
        setTimeout(() => {
          window.localStorage.setItem('phone', phone)
          this.setState({data, lock: 1, loading: 0, active: 1})
        }, timeout(start, end))
      }).catch(response => {
        let {code, message} = response
        let end = Date.now()
        setTimeout(() => {
          Toast.hide()
          if (code == -1001) {
            Modal.alert('提 示', message, [{
              text: '取消'
            }, {
              text: '去登录',
              onPress: login
            }])
          } else {
            Toast.fail(message)
          }
          this.setState && this.setState({lock: 1, loading: 0})
        }, timeout(start, end))
      })
    } else {
      this.setState({
        active: 0
      })
    }
  }
  render () {
    let {phone, data, operator, active, loading, disabled, loaded} = this.state
    let format = (data, index) => {
      let {loading} = data
      return (
        <Button type='ghost' loading={loading} onClick={this.exchange.bind(this, data, index)}>兑换</Button>
      )
    }
    return (
      <div className={classnames({'wrapper wrapper-integral-traffic': true, loaded})}>
        <InputItem
          ref='phone'
          type='phone'
          className={classnames({phone: true, active, loading})}
          extra={<Icon type='loading' />}
          placeholder='请输入手机号'
          maxLength={11}
          onChange={this.onChange.bind(this)}>{operator}</InputItem>
        {(data && data.length) ?
          <div>
            <List renderHeader={() => '- 选择流量 -'}>
            {data.map((item, index) => (
              <Item
              key={index}
              extra={format.bind(this, item, index)()}
              thumb={<div className='icon'>
                  <span>{item.text}</span>
                </div>}>
                <div className='title'>{item.price}金币</div>
                <Brief>即时生效，月底失效</Brief>
              </Item>))}
            </List>
            {tips()}
          </div>
        : <div className='empty'>
          <div>
            <div className='picture' />
            <div className='text'>
              <p>请先输入兑换手机号</p>
              <p>再选择兑换流量</p>
            </div>
          </div>
        </div>
        }
      </div>
    )
  }
};

export default createForm()(traffic)
